#!/usr/bin/env bash
# Testa as correções de autorização da API (ataques devem falhar, uso legítimo continua).
# Uso: com o banco do docker compose e a API em PORT=4317, rode: bash scripts/authz-check.sh
API=http://localhost:4317
J='Content-Type: application/json'
PASS=0; FAIL=0

# check <descrição> <status esperado> <curl args...>
check() {
  local desc=$1 expected=$2; shift 2
  local out code body
  out=$(curl -s -w $'\n%{http_code}' "$@")
  code=${out##*$'\n'}; body=${out%$'\n'*}
  if [ "$code" = "$expected" ]; then PASS=$((PASS+1)); mark=OK; else FAIL=$((FAIL+1)); mark=FALHOU; fi
  printf '[%s] %-62s esperado %s, veio %s  %s\n' "$mark" "$desc" "$expected" "$code" "${body:0:110}"
  LAST_BODY=$body
}

login() { curl -s -X POST "$API/users/login" -H "$J" -d "{\"email\":\"$1\",\"password\":\"$2\"}" | sed -E 's/.*"token":"([^"]+)".*/\1/'; }
q() { docker exec astromaniaka-db psql -U astro -d astromaniaka -tAc "$1"; }

ADM=$(login admin@astromaniaka.com 123456)
KAROL=$(login karol@astromaniaka.com 123456)
ADMIN_ID=$(q "select id from \"User\" where email='admin@astromaniaka.com'")
KAROL_ID=$(q "select id from \"User\" where email='karol@astromaniaka.com'")
KAROL_POST=$(q "select p.id from \"Post\" p join \"User\" u on u.id=p.\"userId\" where u.email='karol@astromaniaka.com' order by p.\"createdAt\" limit 1")
OTHER_POST=$(q "select p.id from \"Post\" p join \"User\" u on u.id=p.\"userId\" where u.email='lucas@astromaniaka.com' order by p.\"createdAt\" limit 1")
HIST=44444444-0000-0000-0000-000000000001
TMPD=$(mktemp -d); q "select json_build_object('title',title,'description',description) from \"PostHistory\" where id='$HIST'" > "$TMPD/hist.json"
q "select json_build_object('title',title,'description',description) from \"Post\" where id='$KAROL_POST'" > "$TMPD/post.json"
AK="Authorization: Bearer $ADM"; KK="Authorization: Bearer $KAROL"

echo "== 1. Usuários e troca de senha =="
echo "-- ataques"
check "GET /users sem token"                                       401 "$API/users"
check "GET /users/user/:id sem token"                              401 "$API/users/user/$ADMIN_ID"
check "POST /users/password sem token (e-mail do admin)"           401 -X POST "$API/users/password" -H "$J" -d '{"email":"admin@astromaniaka.com","currentPassword":"x","password":"hack","confirmPassword":"hack"}'
check "POST /users/password com token inválido"                    401 -X POST "$API/users/password" -H "$J" -H "Authorization: Bearer abc" -d '{"currentPassword":"x","password":"hack","confirmPassword":"hack"}'
check "POST /users/password karol mirando e-mail do admin"         403 -X POST "$API/users/password" -H "$J" -H "$KK" -d '{"email":"admin@astromaniaka.com","currentPassword":"123456","password":"hack","confirmPassword":"hack"}'
check "POST /users/password karol com senha atual errada"          401 -X POST "$API/users/password" -H "$J" -H "$KK" -d '{"currentPassword":"errada","password":"hack","confirmPassword":"hack"}'
check "POST /users/password sem senha atual (contrato antigo)"     400 -X POST "$API/users/password" -H "$J" -H "$KK" -d '{"email":"karol@astromaniaka.com","password":"hack","confirmPassword":"hack"}'
check "POST /users/password senhas não coincidem"                  400 -X POST "$API/users/password" -H "$J" -H "$KK" -d '{"currentPassword":"123456","password":"a1","confirmPassword":"b2"}'
check "Admin continua entrando com 123456"                         200 -X POST "$API/users/login" -H "$J" -d '{"email":"admin@astromaniaka.com","password":"123456"}'
echo "-- uso legítimo"
check "GET /users com token (karol)"                               200 "$API/users" -H "$KK"
echo "     e-mails na listagem: $(grep -o '"email"' <<<"$LAST_BODY" | wc -l) | usuários: $(grep -o '"id"' <<<"$LAST_BODY" | wc -l)"
check "GET /users/user/<admin> pela karol (sem e-mail)"            200 "$API/users/user/$ADMIN_ID" -H "$KK"
grep -q '"email"' <<<"$LAST_BODY" && echo "     ERRO: e-mail exposto" && FAIL=$((FAIL+1)) || echo "     ok: sem e-mail"
check "GET /users/user/<karol> pela própria karol (com e-mail)"    200 "$API/users/user/$KAROL_ID" -H "$KK"
grep -q '"email":"karol@' <<<"$LAST_BODY" && echo "     ok: vê o próprio e-mail" || { echo "     ERRO: sem e-mail"; FAIL=$((FAIL+1)); }
check "POST /users/password karol com senha atual certa"           200 -X POST "$API/users/password" -H "$J" -H "$KK" -d '{"email":"karol@astromaniaka.com","currentPassword":"123456","password":"nova123","confirmPassword":"nova123"}'
check "Login karol com a senha nova"                               200 -X POST "$API/users/login" -H "$J" -d '{"email":"karol@astromaniaka.com","password":"nova123"}'
check "Volta a senha da karol para 123456"                         200 -X POST "$API/users/password" -H "$J" -H "$KK" -d '{"currentPassword":"nova123","password":"123456","confirmPassword":"123456"}'
check "Login karol com 123456 de novo"                             200 -X POST "$API/users/login" -H "$J" -d '{"email":"karol@astromaniaka.com","password":"123456"}'

echo "== 2. Fatos históricos =="
check "PUT /history/:id como USER"                                 403 -X PUT "$API/history/$HIST" -H "$J" -H "$KK" -d '{"title":"hackeado","description":"x"}'
check "DELETE /history/:id como USER"                              403 -X DELETE "$API/history/$HIST" -H "$KK"
check "PUT /history/:id sem token"                                 401 -X PUT "$API/history/$HIST" -H "$J" -d '{"title":"hackeado","description":"x"}'
check "PUT /history/:id como ADMIN (mesmo conteúdo)"               201 -X PUT "$API/history/$HIST" -H "$J" -H "$AK" --data-binary @"$TMPD/hist.json"
echo "     título no banco: $(q "select title from \"PostHistory\" where id='$HIST'")"

echo "== 3. Posts e comentários =="
echo "-- ataques"
check "PUT /posts/<post do lucas> pela karol"                      403 -X PUT "$API/posts/$OTHER_POST" -H "$J" -H "$KK" -d '{"title":"hackeado","description":"x"}'
check "DELETE /posts/<post do lucas> pela karol"                   403 -X DELETE "$API/posts/$OTHER_POST" -H "$KK"
check "POST /posts em nome do admin (auto-aprovado)"               403 -X POST "$API/posts" -H "$J" -H "$KK" -d "{\"title\":\"fake\",\"description\":\"x\",\"userId\":\"$ADMIN_ID\"}"
check "POST /comment em nome do admin"                             403 -X POST "$API/comment" -H "$J" -H "$KK" -d "{\"postId\":\"$OTHER_POST\",\"description\":\"fake\",\"userId\":\"$ADMIN_ID\"}"
check "PUT /posts/<id inexistente>"                                404 -X PUT "$API/posts/00000000-0000-0000-0000-000000000000" -H "$J" -H "$KK" -d '{"title":"a","description":"b"}'
echo "-- uso legítimo"
check "PUT /posts/<post da karol> pela karol"                      201 -X PUT "$API/posts/$KAROL_POST" -H "$J" -H "$KK" --data-binary @"$TMPD/post.json"
check "PUT /posts/<post da karol> pelo admin"                      201 -X PUT "$API/posts/$KAROL_POST" -H "$J" -H "$AK" --data-binary @"$TMPD/post.json"
check "POST /posts pela karol com o próprio userId"                201 -X POST "$API/posts" -H "$J" -H "$KK" -d "{\"title\":\"teste authz\",\"description\":\"x\",\"userId\":\"$KAROL_ID\"}"
NEW_POST=$(sed -E 's/.*"id":"([^"]+)".*/\1/' <<<"$LAST_BODY")
check "DELETE /posts/<post novo> pela própria karol"               204 -X DELETE "$API/posts/$NEW_POST" -H "$KK"
check "POST /posts pela karol (para o admin excluir)"              201 -X POST "$API/posts" -H "$J" -H "$KK" -d "{\"title\":\"teste authz 2\",\"description\":\"x\",\"userId\":\"$KAROL_ID\"}"
NEW_POST=$(sed -E 's/.*"id":"([^"]+)".*/\1/' <<<"$LAST_BODY")
check "DELETE /posts/<post da karol> pelo admin (moderação)"       204 -X DELETE "$API/posts/$NEW_POST" -H "$AK"
check "POST /comment pela karol com o próprio userId"              201 -X POST "$API/comment" -H "$J" -H "$KK" -d "{\"postId\":\"$OTHER_POST\",\"description\":\"teste authz\",\"userId\":\"$KAROL_ID\"}"
NEW_COMMENT=$(sed -E 's/.*"id":"([^"]+)".*/\1/' <<<"$LAST_BODY")
q "delete from \"Comment\" where id='$NEW_COMMENT'" >/dev/null && echo "     (comentário de teste removido do banco)"

echo
echo "Resultado: $PASS ok, $FAIL falhas"

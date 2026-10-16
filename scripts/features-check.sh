#!/usr/bin/env bash
# Testa as funcionalidades da v2: feed paginado, busca, curtidas, comentários,
# recusa com motivo e gestão de usuários. Cria e apaga os próprios dados de teste.
# Uso: com o banco do docker compose e a API em PORT=4317, rode: bash scripts/features-check.sh
A=${API:-http://localhost:4317}
H='Content-Type: application/json'
P=0; F=0

ck() {
  if [ "$2" = "$3" ]; then P=$((P+1)); echo "[OK] $1 ($3)"
  else F=$((F+1)); echo "[FALHOU] $1: esperado $2, veio $3"; fi
}
tok() { curl -s -X POST "$A/users/login" -H "$H" -d "{\"email\":\"$1\",\"password\":\"123456\"}" | node -pe 'JSON.parse(require("fs").readFileSync(0)).token'; }
js() { node -pe "const j=JSON.parse(require('fs').readFileSync(0)); $1"; }
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

K=$(tok karol@astromaniaka.com); AD=$(tok admin@astromaniaka.com); L=$(tok lucas@astromaniaka.com)
KID=11111111-0000-0000-0000-000000000002
LID=11111111-0000-0000-0000-000000000003
ADID=11111111-0000-0000-0000-000000000001
PP=33333333-0000-0000-0000-000000000007

echo "== Feed"
ck "feed paginado total" 8 "$(curl -s "$A/posts?limit=3" -H "Authorization: Bearer $K" | js 'j.total')"
ck "feed página 3 tem 2" 2 "$(curl -s "$A/posts?limit=3&page=3" -H "Authorization: Bearer $K" | js 'j.items.length')"
ck "busca por autor" 2 "$(curl -s "$A/posts?search=marina" -H "Authorization: Bearer $K" | js 'j.items.length')"
ck "busca na descrição" 1 "$(curl -s "$A/posts?search=polui%C3%A7%C3%A3o" -H "Authorization: Bearer $K" | js 'j.items.length')"
ck "filtro EVENTO" 2 "$(curl -s "$A/posts?type=EVENTO" -H "Authorization: Bearer $K" | js 'j.items.length')"
ck "tipo inválido" 400 "$(code "$A/posts?type=XPTO" -H "Authorization: Bearer $K")"

echo "== Curtidas"
ck "curtir" true "$(curl -s -X POST "$A/posts/$PP/like" -H "Authorization: Bearer $K" | js 'j.liked')"
ck "descurtir" false "$(curl -s -X POST "$A/posts/$PP/like" -H "Authorization: Bearer $K" | js 'j.liked')"
ck "curtir post pendente" 404 "$(code -X POST "$A/posts/33333333-0000-0000-0000-000000000009/like" -H "Authorization: Bearer $K")"
ck "meus posts da karol" 3 "$(curl -s "$A/posts/mine" -H "Authorization: Bearer $K" | js 'j.length')"

echo "== Comentários"
C=$(curl -s -X POST "$A/comment" -H "$H" -H "Authorization: Bearer $K" -d "{\"postId\":\"$PP\",\"description\":\"teste\",\"userId\":\"$KID\"}" | js 'j.id')
ck "lucas edita comentário da karol" 403 "$(code -X PUT "$A/comment/$C" -H "$H" -H "Authorization: Bearer $L" -d '{"description":"x"}')"
ck "karol edita o próprio" 200 "$(code -X PUT "$A/comment/$C" -H "$H" -H "Authorization: Bearer $K" -d '{"description":"editado"}')"
ck "lucas apaga comentário da karol" 403 "$(code -X DELETE "$A/comment/$C" -H "Authorization: Bearer $L")"
ck "admin apaga (moderação)" 204 "$(code -X DELETE "$A/comment/$C" -H "Authorization: Bearer $AD")"

echo "== Recusa com motivo"
NP=$(curl -s -X POST "$A/posts" -H "$H" -H "Authorization: Bearer $L" -d "{\"title\":\"Teste recusa\",\"description\":\"x\",\"userId\":\"$LID\"}" | js 'j.id')
ck "usuário comum recusa post" 403 "$(code -X PUT "$A/admin/posts/$NP/reject" -H "$H" -H "Authorization: Bearer $L" -d '{"reason":"motivo"}')"
ck "admin recusa" 200 "$(code -X PUT "$A/admin/posts/$NP/reject" -H "$H" -H "Authorization: Bearer $AD" -d '{"reason":"Faltou contexto"}')"
ck "autor vê REJECTED" REJECTED "$(curl -s "$A/posts/mine" -H "Authorization: Bearer $L" | js "j.find(p=>p.id=='$NP').status")"
ck "autor edita" 201 "$(code -X PUT "$A/posts/$NP" -H "$H" -H "Authorization: Bearer $L" -d '{"title":"Teste recusa v2","description":"com contexto"}')"
ck "volta para PENDING" PENDING "$(curl -s "$A/posts/mine" -H "Authorization: Bearer $L" | js "j.find(p=>p.id=='$NP').status")"
ck "autor apaga o post" 204 "$(code -X DELETE "$A/posts/$NP" -H "Authorization: Bearer $L")"

echo "== Gestão de usuários"
ck "usuário comum lista /admin/users" 403 "$(code "$A/admin/users" -H "Authorization: Bearer $K")"
ck "admin rebaixa a si mesmo" 400 "$(code -X PATCH "$A/admin/users/$ADID/role" -H "$H" -H "Authorization: Bearer $AD" -d '{"access_level":"USER"}')"
curl -s -o /dev/null -X POST "$A/users" -H "$H" -d '{"name":"Teste Gestão","email":"teste.gestao@astromaniaka.com","password":"123456","confirm_password":"123456"}'
T=$(tok teste.gestao@astromaniaka.com)
TID=$(curl -s "$A/admin/users" -H "Authorization: Bearer $AD" | js "j.find(u=>u.email=='teste.gestao@astromaniaka.com').id")
curl -s -o /dev/null -X POST "$A/comment" -H "$H" -H "Authorization: Bearer $T" -d "{\"postId\":\"$PP\",\"description\":\"oi\",\"userId\":\"$TID\"}"
curl -s -o /dev/null -X POST "$A/posts/$PP/like" -H "Authorization: Bearer $T"
ck "promover" 200 "$(code -X PATCH "$A/admin/users/$TID/role" -H "$H" -H "Authorization: Bearer $AD" -d '{"access_level":"ADMIN"}')"
ck "excluir admin é bloqueado" 400 "$(code -X DELETE "$A/admin/users/$TID" -H "Authorization: Bearer $AD")"
ck "rebaixar" 200 "$(code -X PATCH "$A/admin/users/$TID/role" -H "$H" -H "Authorization: Bearer $AD" -d '{"access_level":"USER"}')"
ck "excluir usuário com conteúdo (cascata)" 204 "$(code -X DELETE "$A/admin/users/$TID" -H "Authorization: Bearer $AD")"

echo
echo "Resultado: $P ok, $F falhas"
[ "$F" -eq 0 ]

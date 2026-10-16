# astroserver

API do Astromaniaka (Express + Prisma + PostgreSQL).

## Rodando localmente

1. Suba o banco (Postgres 16 na porta **5433**):

   ```bash
   docker compose up -d
   ```

   Na primeira subida, os scripts em `docker/postgres/init/` criam as tabelas
   (`01-schema.sql`) e inserem a massa de dados (`02-seed.sql`).

2. Crie o `.env` a partir do exemplo e instale as dependências:

   ```bash
   cp example.env .env
   npm i
   npx prisma generate
   ```

3. Inicie a API:

   ```bash
   npm run dev
   ```

## Massa de dados

Todos os usuários do seed usam a senha `123456`.

| E-mail                   | Perfil |
| ------------------------ | ------ |
| admin@astromaniaka.com   | ADMIN  |
| karol@astromaniaka.com   | USER   |
| lucas@astromaniaka.com   | USER   |
| marina@astromaniaka.com  | USER   |
| pedro@astromaniaka.com   | USER   |
| julia@astromaniaka.com   | USER   |

Também são criados 8 astrônomos, 12 posts (3 aguardando aprovação e 1 recusado
com motivo), 5 fatos históricos, 10 comentários e 11 curtidas.

Para recriar o banco do zero com o seed:

```bash
docker compose down -v && docker compose up -d
```

Já tinha o banco criado antes das curtidas e da recusa com motivo? Aplique a
migração sem perder dados:

```bash
npx prisma db execute --file docker/postgres/migrations/001-funcionalidades-v2.sql --schema prisma/schema.prisma
```

Se mudar o `prisma/schema.prisma`, gere o schema SQL novamente:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > docker/postgres/init/01-schema.sql
```

#Pasos para iniciar el proyecto

1. configurar el archivo .env
2. pnpm install
3. iniciar el docker: docker compose up -d
4. npx prisma generate (este si no hay migraciones)
5. npx prisma migrate dev
6. pnpm dev

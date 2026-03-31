pour modifier la base de donnée  : 

modify -> prisma/schema.prisma
npx prisma migrate dev --name add-feature
npx prisma generate
modify -> seed.ts file
npx prisma db seed
npx prisma studio to see the data
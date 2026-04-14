on install
 
npm install next-auth@beta
on installe les packages auth de nextjs
npx auth secret
this is to generate a auth secret that is the only variable mandatory. this is a random value used by the library to encrypt<br>
tokens and emails verification hashes<br>

auth.ts est le fichier central de configuration de auth
cela permet de 
- choisir les provider ( google , github ect)
- la logique des callbacks
- la config des sessions
- les pages customs
- les exports comme auth, signIn, sinOut



route.ts ce fichier est le point d entree http get et post doivent etre exporter pour que auth fonctionne correctement
cela permet d acceder a :
/api/auth/signin
/api/auth/signout
/api/auth/callback/...
/api/auth/session
via des requetes get et post

proxy.ts sert a garder la session actuel en vie et va mettre a jour la session a chaque fois qu elle est appelle

il faut copier la clee qui a ete genere pour la mettre dans les .env file et .env.local file
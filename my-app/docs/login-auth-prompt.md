# Prompt de comprehension du login

Utilise ce prompt si tu veux demander a une IA d'expliquer l'authentification du projet, comment la connecter, et quelles etapes realiser avant que le systeme fonctionne.

```text
Tu es un ingenieur full-stack senior. Analyse mon systeme d'authentification Next.js et explique-le de facon pedagogique mais technique.

Contexte projet :
- Frontend : Next.js App Router
- Auth : NextAuth.js
- Providers OAuth only : Google + GitHub
- Session : JWT
- Base de donnees : PostgreSQL
- ORM : Prisma
- Autorisation : RBAC avance avec roles + permissions
- Middleware de protection : /dashboard, /profile, /settings, /admin
- Page admin accessible uniquement avec la permission ACCESS_ADMIN

Je veux une reponse en 5 sections obligatoires :
1. Comment le login fonctionne de bout en bout
2. Quels fichiers sont impliques et le role de chacun
3. Comment connecter concretement Google et GitHub
4. Quelles etapes faire avant que le systeme marche en local
5. Comment verifier que tout fonctionne apres configuration

Contraintes de reponse :
- Explique le flux complet depuis /login jusqu'a la session JWT
- Explique le role des callbacks NextAuth (signIn, jwt, session)
- Explique comment les roles et permissions arrivent dans le token puis dans la session
- Explique comment le premier utilisateur ou ADMIN_EMAILS devient ADMIN
- Liste clairement les variables .env necessaires
- Donne les commandes exactes a lancer dans l'ordre
- Donne une checklist de verification finale
- Si tu detectes un point fragile ou oublie, signale-le explicitement

Je veux une sortie concise, structuree, actionnable, avec des etapes numerotees.
```

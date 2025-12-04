# Auth 

## 10 owasp 

A01:2021 – Contrôles d'accès défaillants 

Les contrôles d’accès défaillants apparaissent quand un utilisateur peut accéder à des données ou actions qu’il ne devrait pas avoir (ex : IDOR, pages admin, API non protégée).
Cela arrive quand l’application vérifie mal l’authentification ou l’autorisation, ou uniquement côté client.

Toujours vérifier les permissions côté serveur pour chaque requête.
Appliquer un vrai RBAC + principe du moindre privilège.
Utiliser des IDs non prévisibles et tester systématiquement contre les accès non autorisés.
pas ressources public tout doit etre bloquer
pas de listing de dossier attention au .git

A02 : 2021 - défaillance cryptographie

classifier les données pour crypter les données sensibles et ne pas stocker les données sensibles inutile
ne pas utiliser ftp et smtp pour echange de donnée sensible
le reste c'est supabase qui le fait sinon revoir la cryptographie

A03 : 2021 - Injection

utilisation d api sans utilisation d interpreteur ou utiliser outils ORMs
donnée en entrée une liste authorisée avec normalisation quand cela est possible
requete dynamique eviter les caractere speciaux
utiliser LIMIT pour empecher injection sql
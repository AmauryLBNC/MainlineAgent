# Auth 

## 10 owasp 

### A01:2021 – Contrôles d'accès défaillants 

Toujours vérifier les permissions côté serveur pour chaque requête.
Appliquer un vrai RBAC + principe du moindre privilège.
Utiliser des IDs non prévisibles et tester systématiquement contre les accès non autorisés.
pas ressources public tout doit etre bloquer
pas de listing de dossier attention au .git

### A02 : 2021 - défaillance cryptographie

classifier les données pour crypter les données sensibles et ne pas stocker les données sensibles inutile
ne pas utiliser ftp et smtp pour echange de donnée sensible
le reste c'est supabase qui le fait sinon revoir la cryptographie

### A03 : 2021 - Injection

utilisation d api sans utilisation d interpreteur ou utiliser outils ORMs
donnée en entrée une liste authorisée avec normalisation quand cela est possible
requete dynamique eviter les caractere speciaux
utiliser LIMIT pour empecher injection sql

### A04 : 2021 - Conception non securisée

trouver un moyen d evaluer la securite de son app en essayant de la penetrer
utiliser des bibliotheques uniquement securiser se renseigner des qu il y a des vulnerabilité

### A05 : 2021 - Mauvaise configuration de sécurité

utiliser des plateformes techniques les plllus simples possible
faire un processus de durcissement pour le deployement
processus automatise pour verifier l efficacite des config dans les reglages

### A06 : 2021 - Composants vulnérables et obsoletes

supprimer les dependance inutiles/fichier/composant/documents
faire un inventaire des versions de composants avec outils comme versions owasp dependency check ou encore retire.js
que des composants de sources officielle

### A07 : 2021 - Identification et authentification de mauvaise qualité 

auth multi facteur
pas identification par default
integrer test de mots de passe faible
lors inscription test resistance attque d enumeration
enregister tous les echecs de connexion ne pas negilgez

### A08 : 2021 - manque d integrite des donnnees logiciel

utiliser des signatures numerique pour verifier que le logiciel ou les données proviennent de la source prévue
bib et dependance doivent consomer des depots de confiance 

### A09 : 2021 - Carence des systèmes de contrôle et de journalisation

toutes les auth, les erreurs de contrôle d'acces et de contrôle de sortie doivent être enregistrer
avoir une gestion de logs centrliser avec une normalisation des logs
encodage des logs pour ne pas avoir d injection sql

### A10 : 2021 Falsification de requête côté serveur

applique une politique de pare feu refusant par default tout le traffic intranet sauf celui qui est essentiel

## Supabase


### Introduction et mise en place

supabase fournit :

un backend Postgres auto-générée avec authentification
des fonction serverless
stockage de fichiers

#### 1 creer un projet supabase

tableau de bord -> creer un projet -> schema de base (table editor ou table script) -> ajouter rls pour les tables sensibles ('''alter table <table> enable row level security''')

#### 2 demarrer un projet next js

aller dans le fichier ou vous souhaiter metter votre projet et ouvrez un terminal pour rentrer la commande suivante :
'''npx-create-next-app with-supabase'''
et installer les dependances suivantes :
npm install @supabase/supabase.js @supabase/ssr

#### 3 Définir les variables d environnement

supabase fournit les clés :
Url du projet
clé publishable/anon - utilisable coté navigateur
clé service role - rôle admin à garder uniquement côté serveur 

creer un fichier .env.local et definissez :

'''
NEXT_PUBLIC_SUPABASE_URL=<votre‑url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<votre‑clé‑publishable>
SUPABASE_SERVICE_ROLE_KEY=<clé‑service> 
'''

### Organisation du code next js

#### Décomposez les clients supabase

un premier point est le fait de distinguer le coté serveur et client

lib/supabase/client.ts - cree un client pour les composants clients 
lib/supabase/server.ts - crée un cleient pour les composants serveur 
lib/supabase/proxy.ts - gère la mise a jour les cookie refresh le jwt d auth et maj le cookie cote serveur pour le navigateur
proxy.ts - la racine du projet fichier de middle ware next js

#### Utilisation dans les composants

Composants serveur '''import CreateClient from @/lib/supabase/server.ts''' pour interroger la base depuis app/route.ts,server actions ou Server Components utilise la clee service role  ou le jwt en cookie
Utiliser supabase.auth.getUser() ou getClaims() et ne pas faire confiance a getSession() pour valider un user
Composant client '''import createClient from lib/supabase/client.ts.utilise la clee anon et accede aux donnée authorisée par la rls

#### Page de connexion et actions

Une page de connexion comporte un formulaire et des actions login et signup qui appellent supabase.auth.signInWithPadssword() ou supabase.auth.signUp() via le client serveur



### Row level security (RLS) : Principes et bonnes pratiques

RLS est desactivé par default sur les tables supabase et il faut les activés absolument pour les tables sensible.

'''
alter table public.ma_table enable row level security;
alter table public.ma_table force row level security;-- empêche le 
propriétaire de contourner les politiques
'''

ecrire des politique spécifique pour chaque action - avec '''WHERE''' 
lecture - permettre a l'utilisateur d'afficehr seulement ses propres données
'''
create policy "User 
can see own data" on profiles for select using ( (select auth.uid()) = 
user_id );
'''
insertion et suppression - verifier que user.id correspond a auth.user.id avec '''with check'''
mis a jour - combiner using et with check pour le user ne puisse modifier que ses lignes et ne change pas le champs d appropriation

choisir les roles supabase differencie les roles anon ( non authentifié) authentificated specifier le role dans la clause to
utilise les fonctions d authentifications correctement
auth.uid() renvoie l id de l utilisaeur connecte
auth.jwt renvoie le jwt complet (ne rien stocker dans raw_user_meta_data_)
ajoutez des index sur les colonnes utiliser 

### Bonnes Pratiques
utiliser TLS pour les communications
attention au parametre des buckets utiliser url signé avec expiration
limité les types et les tailles des fichiers authorisée
regarder le biller " harden your supabase"

client command

  const [count, setCount] = useState(0); - permet de mettre a jour la valeur et rerend la page
  useEffect(() => {}, []); - s execute des l arrive sur la page
  const inputRef = useRef(null); - permet par exemple de faire en sorte que le user ai le focus sur un champs des son arriver sur la page
  const handleClick = useCallback() - permet d avoir bune fonction qui ne se rerend pas
  const sorted = useMemo() - permet de retenir le calcul

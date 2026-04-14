les imports : 
```ts 
import {NextResponse} from "next/server";
```
cela permet de :
 - renvoyer un json
 - avec le contenu Unhauthorized
 - et le statut 401

```ts
export const PERMISSIONS = {
    ACCESS_ADMIN: "access_admin",
    EDIT_USER : "edit_user",
};
```
c est un objet qui contient tuos les permissions de l app

```ts
hasPermission(session.user.permissions, PERMISSIONS,ACCESS_ADMIN)
```
permet de prendre les permissions utilisateur

```ts
getUserWithRoles()
```
fonction va chercher dans les bases de donnees
 - tous les users
 - leurs roles associes

example : 
```ts
[
    {
        id : "1",
        name: "Amaury",
        roles: ["admin"],
    },
    {
        id: "2",
        name:"paul",
        roles:["users"],
    }
]
```

```ts
export async function GET()
```

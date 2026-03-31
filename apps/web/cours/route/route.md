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

codeblock   
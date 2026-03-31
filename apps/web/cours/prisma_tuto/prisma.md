## 2 INSTALL AND CONFIGURE PRISMA<br>
### 2.1 install an configure prisma<br>
npm install prisma tsx @types/pg --save-dev<br>
npm install @prisma/client @prisma/adapter-pg dotenv pg<br>

if you are using a different provider (mysq,sql server, sqlite) install the corresponding driver adapter paxkage instead of prisma/adapter-pg<br>

once installed initialize prisma in your project<br>
npx prisma init --output ..app/generated prisma<br>
cree le fichier a la racine initialise le projet

this create : <br>
 - a prisma dir<br>
 - a prisma config ts<br>
 - a .env file containing a local dburl<br>

npx create-db<br>

this create : <br>
 - a prisma database pstgres and replace the generated prisma clien when you run prisma generate or prisma migrate dev<br>


### 2.2 define yout prisma schema<br>

prisma/schema.prisma<br>
```js
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User { 
  id    Int     @id @default(autoincrement()) 
  email String  @unique
  name  String?
  posts Post[]
} 
model Post { 
  id        Int     @id @default(autoincrement()) 
  title     String
  content   String?
  published Boolean @default(false) 
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id]) 
} 
```

this create two model user and post with one to many relationship between them<br>

### 2.3 add a dotenv to prisma.config.ts<br>

prisma.config.ts<br>
this is to get acces to the .env variables<br>

```js
import "dotenv/config"; 
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```
### 2.4 run migrations and generate prisma client<br>

create the database table<br>
avant de faire la commande suivante remplir dans le .env le database url par le string que provide la creation de base de donnee<br>
par ailleur il faut aussi valider la base de donnée en uivant le deuxieme lien que donne create-db<br>
npx prisma migrate dev --name init<br>

generate prisma client<br>
npx prisma generate<br>

2.5 seed the database<br>
add some seed data to populate the database with sample users and posts<br>
create a new file called seed.ts in the prisma dir :<br>
seed.ts<br>
```js
import { PrismaClient, Prisma } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    posts: {
      create: [
        {
          title: "Join the Prisma Discord",
          content: "https://pris.ly/discord",
          published: true,
        },
        {
          title: "Prisma on YouTube",
          content: "https://pris.ly/youtube",
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
```
now thell prisma how to run this script by  updating you prisma.config.ts : <br>
prisma.config.ts change :<br>

```js
migrations: {
    path: "prisma/migrations",
    seed: `tsx prisma/seed.ts`, 
  },
```
run the seed script <br>
npx prisma db seed<br>
and open prisma studio to inspect your data<br>
npx prisma studio<br>

### 2.6 set up prisma client 

now that you have a database with some initial data you can set up prisma client and connect it to you database<br>
at the root of your project create a new lib dir and add a prisma.ts file to it<br>
mkdir -p lib && touch lib/prisma.ts<br>

now add the following code to you lib/prisma.ts file : <br>
lib/prisma.ts<br>
```js
import { PrismaClient } from "../app/generated/prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 
const globalForPrisma = global as unknown as {
  prisma: PrismaClient; 
}; 
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL, 
}); 
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, 
  }); 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
export default prisma; 
```

this file create a prisma client and attaches it to the global object so that only one instance of the client is created in your application.<br>
This helps resolve issues with hot reloading that can occur when using prisma orm with next.js in dev mode<br>

you ll use this sclient in the next section to run your first queries<br>

## 3 query your database with prisma orm<br>

now that you have an initialized prisma client, a connection to your database and some initial data you can start querying your data with prisma orm<br>

in this example youèèl make the home page of your application display all of your users<br>
open the app/page.tsx file and replace the existing code with the following : <br>
on le mettra dans un nouveau route pour que ce soit mieux<br>
```js
export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Superblog
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        <li className="mb-2">Alice</li>
        <li>Bob</li>
      </ol>
    </div>
  );
}
```
this gives you a basic page with a title and a list of users however that list is static with hardcoded values lets update the page to fetch the users from your database and make it dynamic<br>

```js
import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Superblog
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
```
your are now importing your client querying the user model for all users and then displaying them in a list<br>
now your homepage is dynamic and will display the users from your database<br>
### 3.1 optionnal update your data

if you want too see what happens when data is updated you could : <br>
update your user table via a sql browser of your choice<br>
change your seed.td file to add more users <br>
change the call to prisma.user.findMany to re-order the users, filter the users, or similar <br>

just reload the page and you'll see the changes<br>

## 4 Add a new posts list page
you have your home page working but you should add a new pagethat display all of your posts <br>

first create a new posts dir in the app dir and create a new page.tsx file inside<br>

second add the following code :<br>

app/posts/page.tsx<br>
```js
import prisma from "@/lib/prisma";

export default async function Posts() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16 text-[#333333]">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)]">Posts</h1>
      <ul className="font-[family-name:var(--font-geist-sans)] max-w-2xl space-y-4">
        <li>My first post</li>
      </ul>
    </div>
  );
}
```
now localhost://3000 will load, but the content is hardcoded again. Let's update it to be dynamic, similarly to the home page<br>

app/posts/page.tsx<br>
```js
import prisma from "@/lib/prisma";

export default async function Posts() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16 text-[#333333]">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)]">Posts</h1>
      <ul className="font-[family-name:var(--font-geist-sans)] max-w-2xl space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <span className="font-semibold">{post.title}</span>
            <span className="text-sm text-gray-600 ml-2">by {post.author.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
this works similarly to the home page, but instead of displaying users, it displays posts. You can also see that you've used include <br>in your prisma client query to fetch the author of each post so you can display the author's name.<br>

this list view is one of the most common pattens in web applications. You're going to add two more pages to your application which <br>you'll also commonly need:a "detail view" and a " create view".<br>

## 5 add a new posts detail page

To complement the post list page you'll add a posts detail page.<br>

In the posts dir, create a new [id] dir and a new page.tsx file inside of that <br>

mkdir -p "app/posts/[id]" && touch "app/posts/[id]/page.tsx"<br>

This page will display a single post"s title, content, and author. Just like your other pages, add the following code to the file : <br>

app/posts/[id]/page.tsx<br>
```js
import prisma from "@/lib/prisma";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <article className="max-w-2xl space-y-4 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold mb-8 text-[#333333]">My first post</h1>
        <p className="text-gray-600 text-center">by Anonymous</p>
        <div className="prose prose-gray mt-8">No content available.</div>
      </article>
    </div>
  );
}
```
as before this page is static with hardcoded content. Let's update it to be dynamic based on the params passed to the page : <br>

app/posts/[id]/page.tsx<br>
```js
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <article className="max-w-2xl space-y-4 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold mb-8 text-[#333333]">{post.title}</h1>
        <p className="text-gray-600 text-center">by {post.author.name}</p>
        <div className="prose prose-gray mt-8">{post.content || "No content available."}</div>
      </article>
    </div>
  );
}
```
there a lot of changes here so lets break it down : <br>
You're using prisma client to fetch the post by its id which you get from the params object<br>
in case the post doesn't exist (maybe it was deleted or maybe you typed a wring id), you call notFound() to display a 404 page<br>
You then display the post"s title, content, and author. if the post doesn"t have content, you display a placeholder message<br>

It's not the prettiest page, but it's a good start. Try it out by navigating to localhost.3000/posts/1 and localhost/3000/posts/2. You<br> can also test the 404 page by navigating to localhost:3000/posts/999.<br>

## 6 Add a new posts create page

to round out your application, you'll add a "create" page for posts. This will let you write your own posts and save them to the database.<br>
As with the other pages, you'll start with a static page and then update it to be dynamic<br>

mkdir -p app/posts/new && touch app/posts/new/page.tsx<br>

now add the following code to the app/posts/new/page.tsx file:<br>

app/posts/new/page.tsx<br>
```js
import Form from "next/form";

export default function NewPost() {
  async function createPost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <Form action={createPost} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter your post title"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-lg mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your post content here..."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Create Post
        </button>
      </Form>
    </div>
  );
}
```
This form looks good but it doesn't do anything yet. Let's update the createPost function to save the post to the database<br>

app/posts/new/page.tsx<br>

```js
import Form from "next/form";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function NewPost() {
  async function createPost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });

    revalidatePath("/posts");
    redirect("/posts");
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <Form action={createPost} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter your post title"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-lg mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your post content here..."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Create Post
        </button>
      </Form>
    </div>
  );
}
```
This page now has a functionnal form! When you submit the form , <br>it will create a new psot in the database and redirect you to the posts list page.<br>
*You also added a revalidatePath call ro revalidate the posts list page so that it will be updated with the new post .<br> That way everyone can read the new post  immediately<br>

Try it out by navidating to localhost:3000/posts/new and submitting the form<br>

## 7 Deply your application to Vercel ( optionnal)

the quicket way to deplay your application to Vercel is to use the Vercel CLI<br>

first install the Vercel CLI<br>

npm install -g vercel<br>

Then, run vercel login to log in to your vercel account <br>
vercel login<br>

Before you deploy you also need to tell vercel to make sure that the prisma client is generated.<br> You can do this by adding a postinstall script to your package .json file<br>
```js
{
  "name": "nextjs-prisma",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "postinstall": "prisma generate",
    "start": "next start",
    "lint": "next lint"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^6.2.1",
    "@prisma/client": "^6.2.1",
    "next": "15.1.4",
    "pg": "^8.13.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.1.4",
    "postcss": "^8",
    "prisma": "^6.2.1",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.19.2",
    "typescript": "^5"
  }
}
```
Afer this change, uou can deplay your application to Vercel by running vercel <br>

vercel<br>

After the deployement is complete, you can visit your application at the url that vercel provides.<br> congratulations you've just deployed a Next.js application with prisma ORL!<br>

## 8 Next step

now that you have a working next.js application with prisma orm here are some ways you can expand and improve your application<br>

add authentification to protect your routes<br>
add the ability to edit and delete posts<br>
add comments to posts<br>
use prisma studio for visual database management<br>

for more information : <br>
https://www.prisma.io/docs/orm<br>
https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction<br>
https://nextjs.org/docs<br>

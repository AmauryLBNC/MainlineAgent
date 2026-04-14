import { defineConfig } from "@prisma/config";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});

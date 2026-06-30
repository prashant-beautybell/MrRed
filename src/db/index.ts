import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  process.env.MRRED_DATABASE_URL ??
    "postgresql://placeholder:placeholder@localhost/placeholder?sslmode=require"
);

export const db = drizzle(sql, { schema });

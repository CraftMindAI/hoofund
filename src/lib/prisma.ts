import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

function connectionString() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  // A local MySQL 8 server without TLS needs this for its default
  // caching_sha2_password login. Hosted databases use TLS and don't.
  if (["localhost", "127.0.0.1"].includes(url.hostname) && !url.searchParams.has("allowPublicKeyRetrieval")) {
    url.searchParams.set("allowPublicKeyRetrieval", "true");
  }
  return url.toString();
}

function createClient() {
  return new PrismaClient({ adapter: new PrismaMariaDb(connectionString()) });
}

// One client per server process (kept on globalThis so dev hot reloads reuse it),
// created on first use so pages that never query MySQL don't need DATABASE_URL.
// `prisma generate` after a schema change reloads the generated PrismaClient class;
// the cached client is then replaced, so new columns work without a restart.
const globalForPrisma = globalThis as unknown as {
  prismaCache?: { client: PrismaClient; Class: typeof PrismaClient };
};

export function getPrisma() {
  const cached = globalForPrisma.prismaCache;
  if (cached?.Class === PrismaClient) return cached.client;

  void cached?.client?.$disconnect();
  const client = createClient();
  globalForPrisma.prismaCache = { client, Class: PrismaClient };
  return client;
}

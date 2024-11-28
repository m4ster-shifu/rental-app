import { PrismaClient } from "@prisma/client";

// Extend the global `NodeJS.Global` type to include `prisma`
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
    }
  }
}

import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

type MockRecord = Record<string, unknown> & { id: string; createdAt: Date; updatedAt?: Date };

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __etsMockTables?: Record<string, MockRecord[]>;
};

function createMockPrisma(): PrismaClient {
  if (!globalForPrisma.__etsMockTables) {
    globalForPrisma.__etsMockTables = {
      registration: [],
      enquiry: [],
      adminUser: [],
    };
  }
  const tables = globalForPrisma.__etsMockTables;

  const matchesWhere = (row: MockRecord, where?: Record<string, unknown>): boolean => {
    if (!where) return true;
    return Object.entries(where).every(([k, v]) => row[k] === v);
  };

  const makeModelDelegate = (tableName: string) => {
    if (!tables[tableName]) tables[tableName] = [];
    const rows = tables[tableName];

    return {
      findMany: async (args?: { where?: Record<string, unknown>; orderBy?: Record<string, "asc" | "desc"> }) => {
        let result = rows.filter((r) => matchesWhere(r, args?.where));
        if (args?.orderBy?.createdAt) {
          const dir = args.orderBy.createdAt === "asc" ? 1 : -1;
          result = [...result].sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * dir);
        }
        return result;
      },
      findFirst: async (args?: { where?: Record<string, unknown> }) => {
        return rows.find((r) => matchesWhere(r, args?.where)) ?? null;
      },
      findUnique: async (args: { where: Record<string, unknown> }) => {
        return rows.find((r) => matchesWhere(r, args?.where)) ?? null;
      },
      create: async (args: { data: Record<string, unknown> }) => {
        const now = new Date();
        const record: MockRecord = {
          id: crypto.randomUUID(),
          ...args.data,
          createdAt: now,
          updatedAt: now,
        };
        rows.push(record);
        return record;
      },
      update: async (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        const idx = rows.findIndex((r) => matchesWhere(r, args.where));
        if (idx === -1) throw new Error(`Record not found in ${tableName}`);
        rows[idx] = { ...rows[idx], ...args.data, updatedAt: new Date() };
        return rows[idx];
      },
      delete: async (args: { where: Record<string, unknown> }) => {
        const idx = rows.findIndex((r) => matchesWhere(r, args.where));
        if (idx === -1) throw new Error(`Record not found in ${tableName}`);
        const [removed] = rows.splice(idx, 1);
        return removed;
      },
    };
  };

  return new Proxy(
    {},
    {
      get: (_, prop: string) => makeModelDelegate(prop),
    }
  ) as unknown as PrismaClient;
}

function initPrisma(): PrismaClient {
  const mockPrisma = createMockPrisma();

  if (!process.env.DATABASE_URL) {
    console.warn("[AI Studio] DATABASE_URL not set — using in-memory mock Prisma store");
    return mockPrisma;
  }

  let realPrisma: PrismaClient;
  try {
    realPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  } catch (err) {
    console.warn("[AI Studio] Database not connected — using mock:", err);
    return mockPrisma;
  }

  let useMock = false;

  return new Proxy(realPrisma, {
    get(target, modelProp: string | symbol) {
      if (typeof modelProp !== "string" || modelProp.startsWith("$")) {
        return Reflect.get(target, modelProp);
      }

      const realDelegate = Reflect.get(target, modelProp) as Record<string, (...args: unknown[]) => Promise<unknown>> | undefined;
      const mockDelegate = Reflect.get(mockPrisma, modelProp) as Record<string, (...args: unknown[]) => Promise<unknown>>;

      if (!realDelegate || typeof realDelegate !== "object") {
        return realDelegate;
      }

      return new Proxy(realDelegate, {
        get(delegateTarget, methodProp: string | symbol) {
          if (typeof methodProp !== "string") {
            return Reflect.get(delegateTarget, methodProp);
          }

          const realMethod = Reflect.get(delegateTarget, methodProp);
          if (typeof realMethod !== "function") {
            return realMethod;
          }

          return async (...args: unknown[]) => {
            if (useMock) {
              return mockDelegate[methodProp](...args);
            }
            try {
              return await realMethod.apply(delegateTarget, args);
            } catch (err) {
              console.warn(`[AI Studio] Prisma ${modelProp}.${methodProp} failed — falling back to in-memory mock:`, (err as Error).message);
              useMock = true;
              return mockDelegate[methodProp](...args);
            }
          };
        },
      });
    },
  }) as unknown as PrismaClient;
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? initPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



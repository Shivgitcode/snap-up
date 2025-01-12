import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const globalUrls = pgTable("globalUrls", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  url: varchar("url", { length: 255 }).unique(),
  lastStatusCode: integer("lastStatusCode"),
  lastCheckTime: timestamp("lastCheckTime"),
  createdAt: timestamp("createdAt").defaultNow(),
  activeMonitorCount: integer("activeMonitorCount").default(0),
});

export type GlobalUrl = InferSelectModel<typeof globalUrls>;

/**
 * User Monitors table schema
 * Stores user-specific monitoring configurations and status
 */
export const userMonitors = pgTable("userMonitors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  urlId: text("urlId")
    .notNull()
    .references(() => globalUrls.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  interval: integer("checkInterval").notNull(),
  isActive: boolean("isActive").default(true),
  isPaused: boolean("isPaused").default(false),
  lastNotificationSent: timestamp("lastNotificationSent"),
  createdAt: timestamp("createdAt").defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export type UserMonitor = InferSelectModel<typeof userMonitors>;

/**
 * Monitor History table schema
 * Stores historical status checks for each URL
 */
export const monitorHistory = pgTable("monitorHistory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  urlId: text("urlId")
    .notNull()
    .references(() => globalUrls.id, { onDelete: "cascade" }),
  statusCode: integer("statusCode"),
  responseTime: integer("responseTime"),
  checkedAt: timestamp("checkedAt").defaultNow(),
});

export type MonitorHistory = InferSelectModel<typeof monitorHistory>;

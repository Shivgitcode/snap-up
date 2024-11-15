import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    uuid,
    varchar,

} from "drizzle-orm/pg-core"
import { InferSelectModel } from "drizzle-orm"
import type { AdapterAccountType } from "next-auth/adapters"



export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),

})

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
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

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
)

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
)

export const monitors = pgTable("monitors", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: varchar("url", { length: 255 }).unique(),
    interval: integer("time"),
    name: varchar("name", { length: 255 }).unique(),
    userId: text("userId").notNull().references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow(),
    latestCheck: timestamp("latestCheck")

})

export type Monitor = InferSelectModel<typeof monitors>

export const monitorRelations = pgTable("monitorRelations", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id),
    monitorId: text("monitorId").notNull().references(() => monitors.id)

})
export type MonitorRelation = InferSelectModel<typeof monitorRelations>

export const monitorstatus = pgTable("monitorStatus", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    statuscode: integer("statuscode"),
    status: text("status")
})

export type MonitorStatus = InferSelectModel<typeof monitorstatus>


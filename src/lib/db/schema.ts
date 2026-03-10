import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    party_name: text("party_name").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    expires_at: timestamp("expires_at").notNull(),
});

export const photos = pgTable("photos", {
    id: uuid("id").primaryKey().defaultRandom(),
    session_id: uuid("session_id")
        .references(() => sessions.id, { onDelete: "cascade" })
        .notNull(),
    url: text("url").notNull(),
    filter_config: jsonb("filter_config").notNull(),
    captured_at: timestamp("captured_at").defaultNow().notNull(),
});

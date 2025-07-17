import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  boolean,
  uuid,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";

export const filesTable = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  path: varchar("path").notNull(),
  size: integer("size").notNull(),
  type: varchar("type").notNull(), //"folder"
  fileUrl: varchar("file_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  userId: varchar("userid").notNull(),
  fileId: varchar("file_id"),
  parentId: uuid("parent_id"),
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(filesTable, ({ one, many }) => ({
  parent: one(filesTable, {
    fields: [filesTable.parentId],
    references: [filesTable.id],
  }),
  children: many(filesTable),
}));

export type File = typeof filesTable.$inferSelect;
export type InsertFile = typeof filesTable.$inferInsert;

// ------------------------------------------------------------------

export const UserStorageInfo = pgTable("storageinfo", {
  id: uuid("id").defaultRandom(),
  userId: varchar("userid").primaryKey(),
  storageUsed: bigint({ mode: "number" }).default(0),
  storageCapacity: bigint({ mode: "number" }).default(1073741824),
  storageUsedPercentage: integer("storage_used_percentage").default(0),
});

export type UserStorageInfo = typeof UserStorageInfo.$inferSelect;
export type InsertUserStorageInfo = typeof UserStorageInfo.$inferInsert;

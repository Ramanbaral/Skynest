import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, boolean, uuid, timestamp } from "drizzle-orm/pg-core";

export const filesTable = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  path: varchar("path").notNull(),
  size: integer("size").notNull(),
  type: varchar("type").notNull(), //"folder"
  fileUrl: varchar("file_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  userId: varchar("user_id").notNull(),
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

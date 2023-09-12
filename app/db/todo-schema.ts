import { serial, varchar, boolean, pgTable } from "drizzle-orm/pg-core";

export const todos = pgTable("todo", {
  id: serial("id"),
  title: varchar("title", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  isDone: boolean("is_done"),
});
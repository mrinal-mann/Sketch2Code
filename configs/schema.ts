import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(0),
});

export const Sketch2CodeTable = pgTable("sketch2code", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar(),
  imageUrl: varchar(),
  model: varchar(),
  description: varchar(),
  code: json(),
  createdBy: varchar(),
});

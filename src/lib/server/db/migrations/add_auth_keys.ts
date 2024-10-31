import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export async function up(db: any) {
  await db.schema.createTable("auth_keys", (table) => {
    table.text("id").primaryKey();
    table.uuid("user_id").references("users.id").onDelete("cascade").notNull();
    table.text("hashed_password");
  });
}

export async function down(db: any) {
  await db.schema.dropTable("auth_keys");
} 
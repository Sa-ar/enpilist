import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { todos } from "~/db/todo-schema";

export function getTodo({
  id,
  userId,
}: {
  id: number;
  userId: string;
}) {
  return db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))).execute();
}

export function getTodoListItems({ userId }: { userId: string }) {
  return db.select().from(todos).where(eq(todos.userId, userId)).execute();
}

export function createTodo({
  title,
  userId,
}: {
  title: string;
  userId: string;
}) {
  return db.insert(todos).values({ title, userId, isDone: false }).returning();
}

export function deleteTodo({
  id,
  userId,
}: { id: number; userId: string }) {
  return db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))).execute();
}

export function updateTodo({
  id,
  userId,
  title,
}: {
  id: number;
  userId: string;
  title: string;
}) {
  return db
    .update(todos)
    .set({ title })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)))
    .returning();
}

export async function toggleTodo({
  id,
  userId,
}: {
  id: number;
  userId: string;
}) {
  const [{ isDone }] = await db
    .select({
      isDone: todos.isDone,
    })
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)))
    .execute();

  return db
    .update(todos)
    .set({ isDone: !isDone })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)))
    .returning();
}

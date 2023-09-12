import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/db";
import { todos } from "~/db/todo-schema";

export const loader = async () => {
  try {
    const todoList = await db.select().from(todos).execute();

    return json({ success: true, todoList, error: null });
  } catch (error) {
    console.log(error);
    return json({ success: false, todoList: [], error }, { status: 500 });
  }
};

function Todo() {
  const { success, error } = useLoaderData<typeof loader>();

  if (!success) {
    return (
      <div>
        <h1>Error</h1>
        <p>{String(JSON.stringify(error)) ?? ""}</p>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-4xl font-bold text-center text-gray-800 my-8"
      >Todo List</h1>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default Todo;

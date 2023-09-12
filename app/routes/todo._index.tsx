import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { deleteTodo, getTodoListItems, toggleTodo } from "~/models/todo.server";

export const loader = async (args: LoaderArgs) => {
    const { userId } = await getAuth(args);

  if (!userId) return json({ errors: { title: "Unauthorized" } }, { status: 401 });

  const todos = await getTodoListItems({ userId });
  if (!todos) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ todos });
};

export const action = async (args: ActionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return json({ errors: { title: "Unauthorized" } }, { status: 401 });
  const data = new URLSearchParams(await args.request.text())
  
  if (!data.has("todoId")) {
    return json({ errors: { title: "Todo not found" } }, { status: 404 });
  }

  const todoId = Number(data.get("todoId"));

  if (isNaN(todoId)) {
    return json({ errors: { title: "Todo is not a number" } }, { status: 404 });
  }

  switch (args.request.method.toLowerCase()) {
    case "delete":
      return await deleteTodo({ id: todoId, userId });
    case "patch":
      return await toggleTodo({
        id: todoId,
        userId,
      });
    default:
      return json({ errors: { title: "Method not allowed" } }, { status: 405 });
  }
};

export default function TodoIndexPage() {
  const data = useLoaderData<typeof loader>();

  if (!data) {
    return null;
  }

  if ("errors" in data) {
    return (
      <div>
        <h1>Error</h1>
        <p>{String(JSON.stringify(data.errors)) ?? ""}</p>
      </div>
    );
  }
  
  if (data.todos.length === 0) {
    return (
      <p>
        No todos yet. <Link to="new" className="text-blue-500 underline">Create one</Link>
      </p>
    );
  }
  
  return (
    <>
      <Link to="new" className="text-blue-500 underline">
        add
      </Link>
      <Outlet />
      <ul className="flex flex-col gap-2">
        {data.todos.map((todo) => (
          <li key={todo.id} className="flex gap-2">
            <Form method="patch">
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit">
                <label className="p-2 flex items-center gap-2 pl-0">
                  <input
                    type="checkbox"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                    defaultChecked={todo.isDone ?? false}
                  />
                  {todo.title}
                </label>
              </button>
            </Form>
            <Form method="delete">
              <input type="hidden" name="todoId" value={todo.id} />
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Delete
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </>
  );
}

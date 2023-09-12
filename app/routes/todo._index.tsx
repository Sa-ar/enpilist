import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getTodoListItems } from "~/models/todo.server";

export const loader = async (args: LoaderArgs) => {
    const { userId } = await getAuth(args);

  if (!userId) return json({ errors: { title: "Unauthorized" } }, { status: 401 });

  const todos = await getTodoListItems({ userId });
  if (!todos) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ todos });
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
      <ul className="flex flex-col gap-2">
        {data.todos.map((todo) => (
          <li key={todo.id} className="flex gap-2">
            <Link to={String(todo.id)} className="flex-1">
              {todo.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

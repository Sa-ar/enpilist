import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createTodo } from "~/models/todo.server";

export const action = async (args: ActionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) return json({ errors: { title: "Unauthorized" } }, { status: 401 });

  const formData = await args.request.formData();
  const title = formData.get("title");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required" } },
      { status: 400 },
    );
  }

  const [todo] = await createTodo({ title, userId });

  if (!todo) {
    return json({ errors: { title: "Could not create todo" } }, { status: 500 });
  }

  return redirect(`/todo`);
};

export default function NewTodoPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        ) : null}
      </div>

      <div className="text-right flex gap-2 items-center justify-end">
        <button
          type="button"
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:bg-gray-400"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}

import type { V2_MetaFunction } from "@remix-run/node";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/remix";
import { Link } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

 
export default function Index() {
  return (
    <div>
      <h1>Enpilist</h1>
      <SignedIn>
        <p>You are signed in!</p>
        <UserButton />
        <Link to="/todo">My todo list</Link>
      </SignedIn>
      <SignedOut>
        <p>You are not signed in.</p>
        <Link to="/sign-up">Sign up</Link>
        <Link to="/sign-in">Sign in</Link>
      </SignedOut>
    </div>
  );
}

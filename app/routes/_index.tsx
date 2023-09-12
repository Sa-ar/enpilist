import type { V2_MetaFunction } from "@remix-run/node";

import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/remix";

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
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}

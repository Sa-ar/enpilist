import type { V2_MetaFunction, LoaderFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
 
import { rootAuthLoader } from "@clerk/remix/ssr.server";

import { ClerkApp, V2_ClerkErrorBoundary } from "@clerk/remix";

import stylesheet from "~/styles.global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet }
];
 
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Enpilist | Remix" },
    {
      property: "og:title",
      content: "Enpilist",
    },
    {
      name: "description",
      content: "This app is the best",
    },
    {
      property: "charset",
      content: "utf-8",
    },
    {
      property: "viewport",
      content: "width=device-width,initial-scale=1",
    }
  ];
};
 
export const loader: LoaderFunction = (args) => rootAuthLoader(args);
 
export const ErrorBoundary = V2_ClerkErrorBoundary();

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);

import { route, type Route } from "@std/http/unstable-route";
import { serveDir } from "@std/http/file-server";

const routes: Route[] = [
  {
    method: ["GET"],
    pattern: new URLPattern({ pathname: "/endpoints" }),
    handler: () => new Response("About page"),
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

Deno.serve(route(routes, defaultHandler));

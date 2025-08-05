import type { APIRoute } from "astro";

export const GET: APIRoute = ({ redirect, cookies }) => {
  cookies.delete("session", {
    path: "/",
  });
  return redirect("/");
};

export const POST: APIRoute = ({ redirect, cookies }) => {
  cookies.delete("session", {
    path: "/",
  });
  return redirect("/");
};

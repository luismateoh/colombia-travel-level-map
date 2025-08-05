import type { APIRoute } from "astro";
import getUserData from "@/firebase/utils/auth/getUserData";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const sessionCookie = cookies.get("session")?.value ?? null;
    const user = await getUserData(sessionCookie);
    
    if (user) {
      return new Response(
        JSON.stringify({ 
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          } 
        }),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ user: null }),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error checking session" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
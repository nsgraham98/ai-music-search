import { authenticateCookie } from "@/lib/authenticate-calls.js";

// GET - Verify session cookie and return session data, user info
export async function GET(req) {
  try {
    const decoded = await authenticateCookie(req);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "No valid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, authUser: decoded }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET session error:", error);
    return new Response(JSON.stringify({ error: "Failed to get session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // Get the cookie store
  cookieStore.delete("__cookie"); // or whatever your cookie name is

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

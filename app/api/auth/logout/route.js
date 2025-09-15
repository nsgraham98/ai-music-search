// This endpoint is called to log the user out by deleting the session cookie
// Gets called from logout-button.jsx component

import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("__cookie");

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

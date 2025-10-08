// Not used i think... need to confirm
// Endpoint to handle Jamendo account token exchange and refresh
// Used in conjunction with jamendo-callback.jsx

import { authenticateAPICall } from "@/lib/authenticate-calls.js";

export async function POST(req) {
  const decodedToken = await authenticateAPICall(request);
  // const userId = decodedToken.uid; // you can log or use this if needed
  const { code, grant_type } = await req.json();

  let params;

  if (grant_type === "authorization_code") {
    params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID,
      client_secret: process.env.JAMENDO_CLIENT_SECRET,
      code,
      redirect_uri: process.env.NEXT_PUBLIC_JAMENDO_REDIRECT_URI,
    });
  } else if (grant_type === "refresh_token") {
    params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID,
      client_secret: process.env.JAMENDO_CLIENT_SECRET,
      refresh_token: code,
    });
  } else {
    return new Response("Unsupported grant_type", { status: 400 });
  }

  const res = await fetch("https://api.jamendo.com/v3.0/oauth/grant", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    console.error("Token fetch failed:", await res.text());
    return new Response("Token exchange failed", { status: 500 });
  }

  const data = await res.json();
  const now = new Date.now(); // removed an unnecessary GetNow() function from another file and replaced it with this. Haven't tested yet
  return new Response(
    JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: now + data.expires_in * 1000,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

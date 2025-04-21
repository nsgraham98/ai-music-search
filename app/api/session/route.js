import { getSessionData } from "@/services/session";
import { adminAuth, db } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { cleanForFirestore } from "@/utils/clean";

export async function GET(request) {
  const cookies = request.headers.get("cookies");
  const sessionData = await getSessionData(cookies);

  return new Response(
    JSON.stringify({
      sessionData: sessionData,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// saves the session data to the database
export async function POST(req) {
  try {
    const { token, providerAccessToken, thirdPartyTokens } = await req.json();
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const sessionData = cleanForFirestore({
      uid,
      jamendo_access_token: thirdPartyTokens?.access_token,
      jamendo_refresh_token: thirdPartyTokens?.refresh_token,
      expires_at: thirdPartyTokens?.expires_at,
      providerAccessToken,
      created_at: new Date(),
    });
    console.log("Session data:", sessionData);
    await db.collection("sessions").doc(uid).set(
      {
        sessionData,
      },
      { merge: true }
    );

    // cookies().set("__session", token, {
    //   httpOnly: true,
    //   // secure: true, // Uncomment this line if using HTTPS
    //   path: "/",
    //   maxAge: 60 * 60 * 24, // 1 day
    // });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Session error:", err);
    return new Response("Failed", { status: 500 });
  }
}

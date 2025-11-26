import { NextResponse } from "next/server";
import { authenticateCookie } from "@/lib/authenticate-calls";
import { dbAdmin } from "@/lib/firebase-admin";

export async function GET(request) {
  try {
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    const sessionDoc = await dbAdmin.collection("sessions").doc(uid).get();
    const spotifyTokens = sessionDoc.data()?.spotifyTokens;

    return NextResponse.json({
      connected: !!spotifyTokens?.access_token,
      hasRefreshToken: !!spotifyTokens?.refresh_token,
    });
  } catch (error) {
    return NextResponse.json({ connected: false }, { status: 200 });
  }
}

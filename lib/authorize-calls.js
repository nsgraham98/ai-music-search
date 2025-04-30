import { adminAuth } from "./firebase-admin.js";

export async function authorizeAPICall(request) {
  const authHeader = request.headers.get("Authorization");
  console.log("Authorization Header:", authHeader); // Log the authorization header for debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    if (error.name === "FirebaseAuthError") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    console.error("Authorization error:", error);
    return new Response(JSON.stringify({ error: "Authorization failed" }), {
      status: 500,
    });
  }
}

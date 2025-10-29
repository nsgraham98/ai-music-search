// Route for handling user operations by userID

import { dbAdmin } from "@/lib/firebase-admin.js";

// Get user by userID (other users' profiles)
export async function GET(req, { params }) {
  const { userID } = await params;
  // Implement logic to get user by userID
  if (!userID) {
    return new Response(JSON.stringify({ error: "UserID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userDocRef = db.collection("users").doc(userID);
  const userDoc = await userDocRef.get();

  if (!userDoc) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userData = userDoc.data();
  const cleanedUser = { displayName: userData.displayName, uid: userData.uid }; // Exclude sensitive fields
  return new Response(JSON.stringify({ ok: true, user: cleanedUser }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

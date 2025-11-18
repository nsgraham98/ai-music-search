// Route for handling user operations by userID

import { dbAdmin, adminAuth } from "@/lib/firebase-admin.js";
import { NextResponse } from "next/server";

// Get user by userID (other users' profiles)
// export async function GET(req, { params }) {
//   const { userID } = await params;
//   // Implement logic to get user by userID
//   if (!userID) {
//     return new Response(JSON.stringify({ error: "UserID is required" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

<<<<<<< HEAD
  const userDocRef = dbAdmin.collection("users").doc(userID);
  const userDoc = await userDocRef.get();
=======
//   const userDocRef = dbAdmin.collection("users").doc(userID);
//   const userDoc = await userDocRef.get();
>>>>>>> main

//   if (!userDoc) {
//     return new Response(JSON.stringify({ error: "User not found" }), {
//       status: 404,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
//   const userData = userDoc.data();
//   const cleanedUser = { displayName: userData.displayName, uid: userData.uid }; // Exclude sensitive fields
//   return new Response(JSON.stringify({ ok: true, user: cleanedUser }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
export async function GET(request, { params }) {
  try {
    const { userID: userId } = await params;

    // Get user from Firebase Auth
    const userRecord = await adminAuth.getUser(userId);

    return NextResponse.json({
      success: true,
      displayName: userRecord.displayName || userRecord.email || "Anonymous",
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Return anonymous if user not found
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({
        success: true,
        displayName: "Anonymous",
      });
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

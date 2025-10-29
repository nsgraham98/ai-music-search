import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request, { params }) {
  try {
    const { id: userId } = await params;

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

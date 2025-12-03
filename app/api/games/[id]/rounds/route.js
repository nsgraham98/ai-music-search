import { NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebase-admin";

/**
 * GET /api/games/[id]/rounds
 * Get all rounds for a game
 */
export async function GET(request, { params }) {
  try {
    const { id: gameId } = await params;

    if (!gameId) {
      return NextResponse.json(
        { success: false, error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Get all rounds for this game
    const roundsSnapshot = await dbAdmin
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .get();

    const rounds = {};
    roundsSnapshot.forEach((doc) => {
      rounds[doc.id] = doc.data();
    });

    return NextResponse.json({
      success: true,
      rounds,
    });
  } catch (error) {
    console.error("Error fetching rounds:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch rounds",
      },
      { status: 500 }
    );
  }
}

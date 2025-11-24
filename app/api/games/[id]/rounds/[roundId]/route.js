// API endpoint for fetching round details
// Handles retrieving specific round information

import { NextResponse } from "next/server";
// import { getRoundById } from "../../../game-handler/games";
import { getRoundById } from "@/app/api/games/game-handler/games";

export async function GET(request, { params }) {
  try {
    const { id: gameId, roundId } = await params;

    // Get the round details (authentication happens inside getRoundById)
    const result = await getRoundById(gameId, roundId, request);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found" || result.error === "Round not found"
          ? 404
          : result.error === "Access denied"
            ? 403
            : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      round: result.round,
    });
  } catch (error) {
    console.error("Error in round GET endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint for closing voting on a round
// Only accessible by game creator

import { NextResponse } from "next/server";
// import { closeVoting } from "../../../../../../game-handler/games";
import { closeVoting } from "@/app/api/games/game-handler/games";

export async function POST(request, { params }) {
  try {
    const { id: gameId, roundId } = await params;

    // Close voting (authentication happens inside closeVoting)
    const result = await closeVoting(gameId, roundId, request);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found" || result.error === "Round not found"
          ? 404
          : result.error === "Only the game creator can close voting"
            ? 403
            : result.error === "Voting is not currently open for this round"
              ? 400
              : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in close voting endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

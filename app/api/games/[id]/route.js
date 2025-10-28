// API endpoint for individual game details
// Handles fetching specific game information

import { NextResponse } from "next/server";
import { getGameById } from "../game-handler/games";

export async function GET(request, { params }) {
  try {
    const { id: gameId } = await params;

    // Get the game details (authentication happens inside getGameById)
    const result = await getGameById(gameId, request);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Game not found" ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      game: result.game,
    });
  } catch (error) {
    console.error("Error in individual game GET endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint for individual game details
// Handles fetching specific game information

import { NextResponse } from "next/server";
import { getGameById } from "../game-handler/games";

export async function GET(request, { params }) {
  try {
    const { id: gameId } = await params;

    // Get the user ID from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Get the game details
    const result = await getGameById(gameId, token);

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

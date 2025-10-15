// API endpoint for starting a game
// Transitions game from waiting_for_players to active and creates first round

import { NextResponse } from "next/server";
import { startGame } from "../../game-handler/games";

export async function POST(request, { params }) {
  try {
    const { id: gameId } = await params;

    // Get the authorization token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Start the game
    const result = await startGame(gameId, token);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found"
          ? 404
          : result.error === "Only the game creator can start the game"
            ? 403
            : result.error === "Game cannot be started from current state"
              ? 400
              : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: "Game started successfully",
      game: result.game,
      round: result.round,
    });
  } catch (error) {
    console.error("Error in start game endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

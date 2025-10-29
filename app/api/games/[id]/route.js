// API endpoint for individual game details
// Handles fetching specific game information and deletion

import { NextResponse } from "next/server";
// import { getGameById } from "../game-handler/games";
import { getGameById } from "@/app/api/games/game-handler/games";

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

export async function DELETE(request, { params }) {
  try {
    const { id: gameId } = await params;

    // Delete the game (authentication happens inside deleteGame)
    const result = await deleteGame(gameId, request);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found"
          ? 404
          : result.error === "Only the game creator can delete the game"
            ? 403
            : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in game DELETE endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

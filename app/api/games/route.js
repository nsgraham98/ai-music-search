// API endpoint for game management
// Handles creation and retrieval of games

import { NextResponse } from "next/server";
import { createGame, getGamesByUser } from "./game-handler/games";

export async function POST(request) {
  try {
    const body = await request.json();
    const { gameName, invitedEmails } = body;

    // Validate required fields
    if (!gameName || typeof gameName !== "string" || !gameName.trim()) {
      return NextResponse.json(
        { error: "Game name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(invitedEmails)) {
      return NextResponse.json(
        { error: "Invited emails must be an array" },
        { status: 400 }
      );
    }

    // Create the game (authentication happens inside createGame)
    const result = await createGame({
      name: gameName.trim(),
      invitedEmails: invitedEmails,
      request: request,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      gameId: result.gameId,
      message: "Game created successfully",
    });
  } catch (error) {
    console.error("Error in games POST endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get games for the user (authentication happens inside getGamesByUser)
    const result = await getGamesByUser(request);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      games: result.games,
    });
  } catch (error) {
    console.error("Error in games GET endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

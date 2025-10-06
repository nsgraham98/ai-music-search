// API endpoint for game management
// Handles creation and retrieval of games

import { NextResponse } from "next/server";
import { createGame, getGamesByUser } from "./game-handler/games";

export async function POST(request) {
  try {
    const body = await request.json();
    const { gameName, invitedEmails } = body;

    // Get the user ID from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

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

    // Create the game
    const result = await createGame({
      name: gameName.trim(),
      invitedEmails: invitedEmails,
      authToken: token,
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
    // Get the user ID from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Get games for the user
    const result = await getGamesByUser(token);

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

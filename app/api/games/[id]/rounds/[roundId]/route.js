// API endpoint for fetching round details
// Handles retrieving specific round information

import { NextResponse } from "next/server";
import { getRoundById } from "../../../game-handler/games";

export async function GET(request, { params }) {
  try {
    const { id: gameId, roundId } = await params;

    // Get the authorization token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Get the round details
    const result = await getRoundById(gameId, roundId, token);

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

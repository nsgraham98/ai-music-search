// API endpoint for song submissions
// Handles submitting songs for a specific round

import { NextResponse } from "next/server";
import { submitSong } from "../../../../../game-handler/games";

export async function POST(request, { params }) {
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

    // Parse the request body
    const body = await request.json();
    const { song } = body;

    if (!song) {
      return NextResponse.json(
        { error: "Song data is required" },
        { status: 400 }
      );
    }

    // Validate song data
    if (!song.id || !song.name || !song.artist_name) {
      return NextResponse.json(
        { error: "Invalid song data: id, name, and artist_name are required" },
        { status: 400 }
      );
    }

    // Submit the song
    const result = await submitSong(gameId, roundId, song, token);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found" || result.error === "Round not found"
          ? 404
          : result.error === "Access denied"
            ? 403
            : result.error === "Game is not active" ||
                result.error ===
                  "Submissions are not currently open for this round" ||
                result.error === "Submission deadline has passed"
              ? 400
              : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: "Song submitted successfully",
      submission: result.submission,
    });
  } catch (error) {
    console.error("Error in song submission endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

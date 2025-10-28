// API endpoint for voting on submissions
// Handles submitting votes for a specific round

import { NextResponse } from "next/server";
import { submitVotes } from "../../../../../game-handler/games";

export async function POST(request, { params }) {
  try {
    const { id: gameId, roundId } = await params;

    // Parse the request body
    const body = await request.json();
    const { votes } = body;

    if (!votes || typeof votes !== "object") {
      return NextResponse.json(
        { error: "Votes data is required" },
        { status: 400 }
      );
    }

    // Submit the votes (authentication happens inside submitVotes)
    const result = await submitVotes(gameId, roundId, votes, request);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found" || result.error === "Round not found"
          ? 404
          : result.error === "Access denied" ||
              result.error === "Only the game creator can close voting"
            ? 403
            : result.error === "Voting is not currently open for this round" ||
                result.error === "You must submit a song before voting" ||
                result.error === "You cannot vote for your own submission" ||
                result.error?.includes("Invalid vote count") ||
                result.error?.includes("You can only allocate")
              ? 400
              : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: "Votes submitted successfully",
      voteSubmission: result.voteSubmission,
    });
  } catch (error) {
    console.error("Error in vote submission endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

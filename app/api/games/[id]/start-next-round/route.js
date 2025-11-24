import { NextResponse } from "next/server";
import { startNextRound } from "../../game-handler/games";

export async function POST(request, { params }) {
  try {
    const { id: gameId } = await params;

    // Start next round (authentication happens inside startNextRound)
    const result = await startNextRound(gameId, request);

    if (!result.success) {
      const statusCode =
        result.error === "Game not found"
          ? 404
          : result.error === "Only the game creator can start the next round"
            ? 403
            : result.error === "Game must be active to start next round"
              ? 400
              : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      round: result.round,
      roundNumber: result.roundNumber,
    });
  } catch (error) {
    console.error("Error in start next round endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

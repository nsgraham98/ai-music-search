import { joinGame } from "../game-handler/games";

export async function POST(request) {
  try {
    const { joinCode } = await request.json();

    if (!joinCode) {
      return Response.json(
        { success: false, error: "Join code is required" },
        { status: 400 }
      );
    }

    const result = await joinGame(joinCode, request);

    if (!result.success) {
      return Response.json(result, { status: 400 });
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in join game API:", error);
    return Response.json(
      { success: false, error: "Failed to join game" },
      { status: 500 }
    );
  }
}

// Game handler functions for interacting with Firestore
// Manages game creation, retrieval, and updates

import { db } from "@/lib/firebase-admin";
import { authenticateUser } from "@/lib/authenticate-calls";

// List of hardcoded themes for rounds
const GAME_THEMES = [
  "Best Song for a Road Trip",
  "Song That Makes You Dance",
  "Perfect Rainy Day Music",
  "Song That Pumps You Up",
  "Best Song from the 90s",
  "Song That Makes You Nostalgic",
  "Best Song to Wake Up To",
  "Song That Tells a Story",
  "Best Instrumental Track",
  "Song That Makes You Feel Powerful",
  "Best Love Song",
  "Song From Your Favorite Movie",
  "Best Song for Working Out",
  "Song That Represents Your Hometown",
  "Best Chill/Relaxing Song",
  "Song You Never Get Tired Of",
  "Best Song with Amazing Lyrics",
  "Song That Represents This Year",
  "Best Discovery of the Year",
  "Song That Should Be More Popular",
];

/**
 * Creates a new game in Firestore
 * @param {Object} gameData - The game data
 * @param {string} gameData.name - Name of the game
 * @param {Array} gameData.invitedEmails - Array of invited email addresses
 * @param {string} gameData.authToken - Authentication token
 * @returns {Object} Result object with success status and game ID or error
 */
export async function createGame({ name, invitedEmails, authToken }) {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(authToken);
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const userId = authResult.user.uid;
    const userEmail = authResult.user.email;

    // Generate a unique game ID
    const gameRef = db.collection("games").doc();
    const gameId = gameRef.id;

    // Create the game document
    const gameData = {
      id: gameId,
      name: name,
      creator: userId,
      created_at: new Date(),
      status: "waiting_for_players",
      current_round: 0, // Will be 1 when first round starts
      players: [userId], // Start with just the creator
      invited_emails: invitedEmails,
      settings: {
        round_duration_days: 7,
        submission_deadline: "friday_midnight",
        voting_deadline: "sunday_midnight",
      },
    };

    // Save to Firestore
    await gameRef.set(gameData);

    // For now, automatically add the creator as confirmed player
    // In the future, you might want to implement an invitation system

    console.log(`Game created successfully: ${gameId} by ${userEmail}`);

    return {
      success: true,
      gameId: gameId,
      game: gameData,
    };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      success: false,
      error: "Failed to create game",
    };
  }
}

/**
 * Gets all games for a specific user
 * @param {string} authToken - Authentication token
 * @returns {Object} Result object with success status and games array or error
 */
export async function getGamesByUser(authToken) {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(authToken);
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const userId = authResult.user.uid;

    // Query games where user is a player or creator
    const gamesSnapshot = await db
      .collection("games")
      .where("players", "array-contains", userId)
      .orderBy("created_at", "desc")
      .get();

    const games = [];
    gamesSnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: true,
      games: games,
    };
  } catch (error) {
    console.error("Error getting games for user:", error);
    return {
      success: false,
      error: "Failed to retrieve games",
    };
  }
}

/**
 * Gets a specific game by ID
 * @param {string} gameId - The game ID
 * @param {string} authToken - Authentication token
 * @returns {Object} Result object with success status and game data or error
 */
export async function getGameById(gameId, authToken) {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(authToken);
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const userId = authResult.user.uid;

    // Get the game
    const gameDoc = await db.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user has access to this game
    if (!gameData.players.includes(userId)) {
      return { success: false, error: "Access denied" };
    }

    return {
      success: true,
      game: {
        id: gameDoc.id,
        ...gameData,
      },
    };
  } catch (error) {
    console.error("Error getting game by ID:", error);
    return {
      success: false,
      error: "Failed to retrieve game",
    };
  }
}

/**
 * Gets a random theme that hasn't been used in this game yet
 * @param {string} gameId - The game ID
 * @returns {string} A random unused theme
 */
export async function getRandomTheme(gameId) {
  try {
    // Get all rounds for this game to see which themes have been used
    const roundsSnapshot = await db
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .get();

    const usedThemes = [];
    roundsSnapshot.forEach((doc) => {
      const roundData = doc.data();
      if (roundData.theme) {
        usedThemes.push(roundData.theme);
      }
    });

    // Filter out used themes
    const availableThemes = GAME_THEMES.filter(
      (theme) => !usedThemes.includes(theme)
    );

    // If all themes have been used, reset and use all themes again
    const themesToChooseFrom =
      availableThemes.length > 0 ? availableThemes : GAME_THEMES;

    // Return a random theme
    const randomIndex = Math.floor(Math.random() * themesToChooseFrom.length);
    return themesToChooseFrom[randomIndex];
  } catch (error) {
    console.error("Error getting random theme:", error);
    // Fallback to a default theme
    return "Best Song of All Time";
  }
}

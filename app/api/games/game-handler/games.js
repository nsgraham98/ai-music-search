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
 * Starts a game by transitioning from waiting_for_players to active
 * Creates the first round with a random theme
 * @param {string} gameId - The game ID
 * @param {string} authToken - Authentication token
 * @returns {Object} Result object with success status and game data or error
 */
export async function startGame(gameId, authToken) {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(authToken);
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const userId = authResult.user.uid;

    // Get the game to verify it exists and user is creator
    const gameRef = db.collection("games").doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user is the creator
    if (gameData.creator !== userId) {
      return {
        success: false,
        error: "Only the game creator can start the game",
      };
    }

    // Check if game is in correct state to start
    if (gameData.status !== "waiting_for_players") {
      return {
        success: false,
        error: "Game cannot be started from current state",
      };
    }

    // Get a random theme for the first round
    const theme = await getRandomTheme(gameId);

    // Create the first round
    const roundRef = gameRef.collection("rounds").doc("1");
    const roundData = {
      round_number: 1,
      theme: theme,
      status: "submissions_open",
      created_at: new Date(),
      submissions_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      voting_deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      submissions: {}, // Will be populated as players submit songs
      votes: {}, // Will be populated during voting phase
    };

    // Start a batch write to update both game and create round
    const batch = db.batch();

    // Update game status and current round
    batch.update(gameRef, {
      status: "active",
      current_round: 1,
      started_at: new Date(),
    });

    // Create the first round
    batch.set(roundRef, roundData);

    // Commit the batch
    await batch.commit();

    console.log(`Game ${gameId} started successfully with theme: ${theme}`);

    return {
      success: true,
      game: {
        ...gameData,
        status: "active",
        current_round: 1,
        started_at: new Date(),
      },
      round: roundData,
    };
  } catch (error) {
    console.error("Error starting game:", error);
    return {
      success: false,
      error: "Failed to start game",
    };
  }
}

/**
 * Gets a specific round by game ID and round ID
 * @param {string} gameId - The game ID
 * @param {string} roundId - The round ID (round number as string)
 * @param {string} authToken - Authentication token
 * @returns {Object} Result object with success status and round data or error
 */
export async function getRoundById(gameId, roundId, authToken) {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(authToken);
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const userId = authResult.user.uid;

    // First check if user has access to the game
    const gameDoc = await db.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user has access to this game
    if (!gameData.players.includes(userId)) {
      return { success: false, error: "Access denied" };
    }

    // Get the round
    const roundDoc = await db
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .doc(roundId)
      .get();

    if (!roundDoc.exists) {
      return { success: false, error: "Round not found" };
    }

    return {
      success: true,
      round: {
        id: roundDoc.id,
        ...roundDoc.data(),
      },
    };
  } catch (error) {
    console.error("Error getting round by ID:", error);
    return {
      success: false,
      error: "Failed to retrieve round",
    };
  }
}

/**
 * Submits a song for a specific round
 * @param {string} gameId - The game ID
 * @param {string} roundId - The round ID (round number as string)
 * @param {Object} songData - The song data to submit
 * @param {string} authToken - Authentication token
 * @returns {Object} Result object with success status and submission data or error
 */
export async function submitSong(gameId, roundId, songData, authToken) {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(authToken);
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const userId = authResult.user.uid;

    // First check if user has access to the game
    const gameDoc = await db.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user has access to this game
    if (!gameData.players.includes(userId)) {
      return { success: false, error: "Access denied" };
    }

    // Check if the game is active
    if (gameData.status !== "active") {
      return { success: false, error: "Game is not active" };
    }

    // Get the round
    const roundRef = db
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .doc(roundId);

    const roundDoc = await roundRef.get();

    if (!roundDoc.exists) {
      return { success: false, error: "Round not found" };
    }

    const roundData = roundDoc.data();

    // Check if round is accepting submissions
    if (roundData.status !== "submissions_open") {
      return {
        success: false,
        error: "Submissions are not currently open for this round",
      };
    }

    // Check if submission deadline has passed
    const now = new Date();
    const deadline = roundData.submissions_deadline.toDate
      ? roundData.submissions_deadline.toDate()
      : new Date(roundData.submissions_deadline);

    if (now > deadline) {
      return { success: false, error: "Submission deadline has passed" };
    }

    // Create the submission object
    const submission = {
      user_id: userId,
      song: songData,
      submitted_at: new Date(),
    };

    // Update the round with the new submission
    await roundRef.update({
      [`submissions.${userId}`]: submission,
    });

    console.log(
      `Song submitted for game ${gameId}, round ${roundId} by user ${userId}`
    );

    return {
      success: true,
      submission: submission,
    };
  } catch (error) {
    console.error("Error submitting song:", error);
    return {
      success: false,
      error: "Failed to submit song",
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

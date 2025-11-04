// Game handler functions for interacting with Firestore
// Manages game creation, retrieval, and updates

import { dbAdmin } from "@/lib/firebase-admin";
import { authenticateCookie } from "@/lib/authenticate-calls";

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
 * Generates a unique 4-digit game code
 * @returns {string} A 4-digit code
 */
async function generateUniqueGameCode() {
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Check if code already exists
    const existingGame = await dbAdmin
      .collection("games")
      .where("join_code", "==", code)
      .where("status", "in", ["waiting_for_players", "active"])
      .limit(1)
      .get();

    if (existingGame.empty) {
      return code;
    }
  }

  // Fallback: use timestamp-based code
  return (Date.now() % 10000).toString().padStart(4, "0");
}

/**
 * Creates a new game in Firestore
 * @param {Object} gameData - The game data
 * @param {string} gameData.name - Name of the game
 * @param {Request} gameData.request - Request object for authentication
 * @returns {Object} Result object with success status and game ID or error
 */
export async function createGame({ name, request }) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // Generate a unique game ID
    const gameRef = dbAdmin.collection("games").doc();
    const gameId = gameRef.id;

    // Generate unique 4-digit join code
    const joinCode = await generateUniqueGameCode();

    // Create the game document
    const gameData = {
      id: gameId,
      name: name,
      creator: userId,
      created_at: new Date(),
      status: "waiting_for_players",
      current_round: 0, // Will be 1 when first round starts
      players: [userId], // Start with just the creator
      join_code: joinCode,
      max_players: 10,
      settings: {
        round_duration_days: 7,
        submission_deadline: "friday_midnight",
        voting_deadline: "sunday_midnight",
      },
    };

    // Save to Firestore
    await gameRef.set(gameData);

    console.log(
      `Game created successfully: ${gameId} by ${userEmail} with code ${joinCode}`
    );

    return {
      success: true,
      gameId: gameId,
      joinCode: joinCode,
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
 * Joins a game using a join code
 * @param {string} joinCode - The 4-digit join code
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and game data or error
 */
export async function joinGame(joinCode, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // Find game by join code
    const gamesSnapshot = await dbAdmin
      .collection("games")
      .where("join_code", "==", joinCode)
      .where("status", "in", ["waiting_for_players", "active"])
      .limit(1)
      .get();

    if (gamesSnapshot.empty) {
      return {
        success: false,
        error: "Game not found. Check your code and try again.",
      };
    }

    const gameDoc = gamesSnapshot.docs[0];
    const gameData = gameDoc.data();
    const gameId = gameDoc.id;

    // Check if user is already in the game
    if (gameData.players.includes(userId)) {
      return {
        success: true,
        gameId: gameId,
        message: "You're already in this game!",
        game: gameData,
      };
    }

    // Check if game is full
    if (gameData.players.length >= (gameData.max_players || 10)) {
      return { success: false, error: "This game is full" };
    }

    // Add user to players array
    await dbAdmin
      .collection("games")
      .doc(gameId)
      .update({
        players: [...gameData.players, userId],
      });

    console.log(`User ${userId} joined game ${gameId} with code ${joinCode}`);

    return {
      success: true,
      gameId: gameId,
      message: "Successfully joined the game!",
      game: {
        ...gameData,
        players: [...gameData.players, userId],
      },
    };
  } catch (error) {
    console.error("Error joining game:", error);
    return {
      success: false,
      error: "Failed to join game",
    };
  }
}

/**
 * Gets all games for a specific user
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and games array or error
 */
export async function getGamesByUser(request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // Query games where user is a player or creator
    const gamesSnapshot = await dbAdmin
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
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and game data or error
 */
export async function getGameById(gameId, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // Get the game
    const gameDoc = await dbAdmin.collection("games").doc(gameId).get();

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
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and game data or error
 */
export async function startGame(gameId, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // Get the game to verify it exists and user is creator
    const gameRef = dbAdmin.collection("games").doc(gameId);
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
      status: "voting_open", // Both submissions and voting are open simultaneously
      created_at: new Date(),
      round_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      submissions: {}, // Will be populated as players submit songs
      votes: {}, // Will be populated during voting phase
    };

    // Start a batch write to update both game and create round
    const batch = dbAdmin.batch();

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
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and round data or error
 */
export async function getRoundById(gameId, roundId, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // First check if user has access to the game
    const gameDoc = await dbAdmin.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user has access to this game
    if (!gameData.players.includes(userId)) {
      return { success: false, error: "Access denied" };
    }

    // Get the round
    const roundDoc = await dbAdmin
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
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and submission data or error
 */
export async function submitSong(gameId, roundId, songData, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // First check if user has access to the game
    const gameDoc = await dbAdmin.collection("games").doc(gameId).get();

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
    const roundRef = dbAdmin
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .doc(roundId);

    const roundDoc = await roundRef.get();

    if (!roundDoc.exists) {
      return { success: false, error: "Round not found" };
    }

    const roundData = roundDoc.data();

    // Check if user has already submitted (can't change submission)
    if (roundData.submissions && roundData.submissions[userId]) {
      return {
        success: false,
        error:
          "You have already submitted a song for this round and cannot change it",
      };
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
    const roundsSnapshot = await dbAdmin
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

/**
 * Submits votes for a specific round
 * @param {string} gameId - The game ID
 * @param {string} roundId - The round ID (round number as string)
 * @param {Object} votesData - Object mapping user IDs to vote counts
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status or error
 */
export async function submitVotes(gameId, roundId, votesData, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // First check if user has access to the game
    const gameDoc = await dbAdmin.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user has access to this game
    if (!gameData.players.includes(userId)) {
      return { success: false, error: "Access denied" };
    }

    // Get the round
    const roundRef = dbAdmin
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .doc(roundId);

    const roundDoc = await roundRef.get();

    if (!roundDoc.exists) {
      return { success: false, error: "Round not found" };
    }

    const roundData = roundDoc.data();

    // Check if round is accepting votes
    if (roundData.status !== "voting_open") {
      return {
        success: false,
        error: "Voting is not currently open for this round",
      };
    }

    // Validate that user has submitted a song for this round
    const submissions = roundData.submissions || {};
    if (!submissions[userId]) {
      return {
        success: false,
        error: "You must submit a song before voting",
      };
    }

    // Validate votes (no voting for yourself, max 5 votes total)
    const MAX_VOTES = 5;
    let totalVotes = 0;

    for (const [votedUserId, voteCount] of Object.entries(votesData)) {
      // Can't vote for yourself
      if (votedUserId === userId) {
        return {
          success: false,
          error: "You cannot vote for your own submission",
        };
      }

      // Validate vote count
      if (voteCount < 0 || !Number.isInteger(voteCount)) {
        return { success: false, error: "Invalid vote count" };
      }

      totalVotes += voteCount;
    }

    if (totalVotes > MAX_VOTES) {
      return {
        success: false,
        error: `You can only allocate up to ${MAX_VOTES} votes total`,
      };
    }

    // Create the vote object
    const voteSubmission = {
      user_id: userId,
      votes: votesData,
      voted_at: new Date(),
      total_votes_allocated: totalVotes,
    };

    // Update the round with the new votes
    await roundRef.update({
      [`votes.${userId}`]: voteSubmission,
    });

    console.log(
      `Votes submitted for game ${gameId}, round ${roundId} by user ${userId}`
    );

    return {
      success: true,
      voteSubmission: voteSubmission,
    };
  } catch (error) {
    console.error("Error submitting votes:", error);
    return {
      success: false,
      error: "Failed to submit votes",
    };
  }
}

/**
 * Closes voting for a round and transitions to results
 * @param {string} gameId - The game ID
 * @param {string} roundId - The round ID (round number as string)
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status or error
 */
export async function closeVoting(gameId, roundId, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

    // Get the game to verify user is creator
    const gameDoc = await dbAdmin.collection("games").doc(gameId).get();

    if (!gameDoc.exists) {
      return { success: false, error: "Game not found" };
    }

    const gameData = gameDoc.data();

    // Check if user is the creator
    if (gameData.creator !== userId) {
      return {
        success: false,
        error: "Only the game creator can close voting",
      };
    }

    // Get the round
    const roundRef = dbAdmin
      .collection("games")
      .doc(gameId)
      .collection("rounds")
      .doc(roundId);

    const roundDoc = await roundRef.get();

    if (!roundDoc.exists) {
      return { success: false, error: "Round not found" };
    }

    const roundData = roundDoc.data();

    // Check if round is in voting phase
    if (roundData.status !== "voting_open") {
      return {
        success: false,
        error: "Voting is not currently open for this round",
      };
    }

    // Update round status to show results
    await roundRef.update({
      status: "voting_closed",
      voting_closed_at: new Date(),
    });

    console.log(`Voting closed for game ${gameId}, round ${roundId}`);

    return {
      success: true,
      message: "Voting closed successfully",
    };
  } catch (error) {
    console.error("Error closing voting:", error);
    return {
      success: false,
      error: "Failed to close voting",
    };
  }
}

/**
 * Deletes a game and all its rounds
 * @param {string} gameId - The game ID to delete
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status or error
 */
export async function deleteGame(gameId, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

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
        error: "Only the game creator can delete the game",
      };
    }

    // Delete all rounds in the game
    const roundsSnapshot = await gameRef.collection("rounds").get();
    const batch = db.batch();

    roundsSnapshot.forEach((roundDoc) => {
      batch.delete(roundDoc.ref);
    });

    // Delete the game document
    batch.delete(gameRef);

    // Commit the batch delete
    await batch.commit();

    console.log(
      `Game ${gameId} and ${roundsSnapshot.size} rounds deleted by user ${userId}`
    );

    return {
      success: true,
      message: "Game deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting game:", error);
    return {
      success: false,
      error: "Failed to delete game",
    };
  }
}

/**
 * Starts the next round in a game
 * @param {string} gameId - The game ID
 * @param {Request} request - Request object for authentication
 * @returns {Object} Result object with success status and new round data or error
 */
export async function startNextRound(gameId, request) {
  try {
    // Authenticate the user using session cookie
    const decodedToken = await authenticateCookie(request);

    // Check if authentication failed
    if (decodedToken instanceof Response) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = decodedToken.uid;

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
        error: "Only the game creator can start the next round",
      };
    }

    // Check if game is active
    if (gameData.status !== "active") {
      return {
        success: false,
        error: "Game must be active to start next round",
      };
    }

    const currentRoundNumber = gameData.current_round || 0;
    const nextRoundNumber = currentRoundNumber + 1;

    // Get a random theme for the next round
    const theme = await getRandomTheme(gameId);

    // Create the next round
    const nextRoundRef = gameRef
      .collection("rounds")
      .doc(nextRoundNumber.toString());
    const nextRoundData = {
      round_number: nextRoundNumber,
      theme: theme,
      status: "voting_open", // Both submissions and voting are open simultaneously
      created_at: new Date(),
      round_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      submissions: {}, // Will be populated as players submit songs
      votes: {}, // Will be populated during voting phase
    };

    // Start a batch write to update game and create round
    const batch = db.batch();

    // Update game's current round
    batch.update(gameRef, {
      current_round: nextRoundNumber,
    });

    // Create the next round
    batch.set(nextRoundRef, nextRoundData);

    // Commit the batch
    await batch.commit();

    console.log(
      `Round ${nextRoundNumber} started for game ${gameId} with theme: ${theme}`
    );

    return {
      success: true,
      round: nextRoundData,
      roundNumber: nextRoundNumber,
    };
  } catch (error) {
    console.error("Error starting next round:", error);
    return {
      success: false,
      error: "Failed to start next round",
    };
  }
}

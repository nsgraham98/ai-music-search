// Round Results Component
// Displays results after voting closes, with song scores and player leaderboard

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import SoundCloudPlayer from "./soundcloud-player";

export default function RoundResults({
  roundData,
  gameId,
  roundNumber,
  allPlayers,
}) {
  const [userNames, setUserNames] = useState({});
  const [loadingNames, setLoadingNames] = useState(true);
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    fetchUserNames();
  }, [roundData]);

  const fetchUserNames = async () => {
    setLoadingNames(true);
    try {
      // Get all unique user IDs from submissions
      const userIds = Object.keys(roundData.submissions || {});
      const names = {};

      // Fetch display names for each user
      for (const userId of userIds) {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            credentials: "include",
          });
          const data = await response.json();
          if (data.success) {
            names[userId] = data.displayName || "Anonymous";
          } else {
            names[userId] = "Anonymous";
          }
        } catch (error) {
          console.error(`Error fetching name for user ${userId}:`, error);
          names[userId] = "Anonymous";
        }
      }

      setUserNames(names);
    } catch (error) {
      console.error("Error fetching user names:", error);
    } finally {
      setLoadingNames(false);
    }
  };

  // Calculate scores for each submission
  const calculateSongScores = () => {
    const submissions = roundData.submissions || {};
    const votes = roundData.votes || {};
    const scores = {};

    // Initialize scores for all submissions
    Object.keys(submissions).forEach((userId) => {
      scores[userId] = {
        totalScore: 0,
        song: submissions[userId].song,
        submittedBy: userId,
      };
    });

    // Tally votes
    Object.values(votes).forEach((voteSubmission) => {
      Object.entries(voteSubmission.votes).forEach(
        ([votedUserId, voteCount]) => {
          if (scores[votedUserId]) {
            scores[votedUserId].totalScore += voteCount;
          }
        }
      );
    });

    // Convert to array and sort by score (highest first)
    return Object.entries(scores)
      .map(([userId, data]) => ({
        userId,
        ...data,
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  // Calculate overall player scores (across all rounds if needed)
  const calculatePlayerScores = () => {
    const songScores = calculateSongScores();
    return songScores.map((entry, index) => ({
      userId: entry.userId,
      displayName: userNames[entry.userId] || "Loading...",
      score: entry.totalScore,
      rank: index + 1,
    }));
  };

  // Get comments for a specific song submission
  const getCommentsForSong = (songUserId) => {
    const votes = roundData.votes || {};
    const comments = [];

    Object.entries(votes).forEach(([voterId, voteData]) => {
      const commentText = voteData.comments?.[songUserId];
      if (commentText && commentText.trim()) {
        comments.push({
          voterId,
          voterName: userNames[voterId] || "Anonymous",
          comment: commentText,
        });
      }
    });

    return comments;
  };

  // Toggle comments visibility for a song
  const toggleComments = (userId) => {
    setShowComments((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const songScores = calculateSongScores();
  const playerScores = calculatePlayerScores();

  if (loadingNames) {
    return (
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} sx={{ color: "white" }} />
          <Typography>Loading results...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 4, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <TrophyIcon sx={{ color: "#ffd700", fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            Round {roundNumber} Results
          </Typography>
        </Box>
        <Typography variant="body1" color="#ccc" mb={1}>
          Theme: <strong>{roundData.theme}</strong>
        </Typography>
        <Typography variant="body2" color="#999">
          Voting closed • {Object.keys(roundData.votes || {}).length} players
          voted
        </Typography>
      </Paper>

      {/* Song Rankings */}
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 4, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Song Rankings
        </Typography>

        {songScores.map((entry, index) => (
          <Card
            key={entry.userId}
            sx={{
              mb: 2,
              bgcolor: "#3e3d3d",
              color: "white",
              border: index === 0 ? "2px solid #ffd700" : "none",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color:
                          index === 0
                            ? "#ffd700"
                            : index === 1
                              ? "#c0c0c0"
                              : index === 2
                                ? "#cd7f32"
                                : "white",
                      }}
                    >
                      #{index + 1}
                    </Typography>
                    {index === 0 && <TrophyIcon sx={{ color: "#ffd700" }} />}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {entry.song.name}
                  </Typography>
                  <Typography variant="body2" color="#ccc" mb={2}>
                    by {entry.song.artist_name}
                  </Typography>
                  <Typography variant="body2" color="#aaa" mb={1}>
                    Submitted by:{" "}
                    <strong style={{ color: "#fff" }}>
                      {userNames[entry.userId] || "Anonymous"}
                    </strong>
                  </Typography>

                  {/* SoundCloud Player */}
                  {entry.song.soundcloud_url && (
                    <Box mt={2} mb={2}>
                      <SoundCloudPlayer url={entry.song.soundcloud_url} />
                    </Box>
                  )}

                  {entry.song.argument && (
                    <Box
                      mt={2}
                      p={2}
                      sx={{ bgcolor: "#2e2d2d", borderRadius: 1 }}
                    >
                      <Typography variant="body2" color="#aaa" mb={1}>
                        Their Case:
                      </Typography>
                      <Typography variant="body2" color="#ddd">
                        {entry.song.argument}
                      </Typography>
                    </Box>
                  )}

                  {/* Comments Section */}
                  {(() => {
                    const comments = getCommentsForSong(entry.userId);
                    if (comments.length > 0) {
                      return (
                        <Box mt={2}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography variant="body2" color="#aaa">
                              Comments ({comments.length})
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleComments(entry.userId)}
                              sx={{
                                color: "#ccc",
                                "&:hover": { color: "#E03FD8" },
                              }}
                            >
                              {showComments[entry.userId] === false ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )}
                            </IconButton>
                          </Box>
                          <Collapse in={showComments[entry.userId] !== false}>
                            <Box mt={1}>
                              {comments.map((commentData, idx) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    bgcolor: "#2e2d2d",
                                    borderRadius: 1,
                                    p: 2,
                                    mb: 1,
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    mb={1}
                                  >
                                    <Chip
                                      label={commentData.voterName}
                                      size="small"
                                      sx={{
                                        bgcolor: "#90ee90",
                                        color: "#000",
                                        fontWeight: "bold",
                                        border: "1px solid #333",
                                        borderRadius: 1,
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="body2" color="#ddd">
                                    {commentData.comment}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </Box>
                      );
                    }
                    return null;
                  })()}
                </Box>
                <Chip
                  label={`${entry.totalScore} ${entry.totalScore === 1 ? "vote" : "votes"}`}
                  sx={{
                    bgcolor: index === 0 ? "#ffd700" : "#90ee90",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    height: "40px",
                    minWidth: "80px",
                    border: "1px solid #333",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}

        {songScores.length === 0 && (
          <Typography variant="body1" color="#999" textAlign="center" py={4}>
            No submissions for this round
          </Typography>
        )}
      </Paper>

      {/* Player Leaderboard */}
      <Paper sx={{ bgcolor: "#2e2d2d", color: "white", p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Scoreboard
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#ccc",
                    fontWeight: "bold",
                    borderBottom: "1px solid #555",
                  }}
                >
                  Rank
                </TableCell>
                <TableCell
                  sx={{
                    color: "#ccc",
                    fontWeight: "bold",
                    borderBottom: "1px solid #555",
                  }}
                >
                  Player
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: "#ccc",
                    fontWeight: "bold",
                    borderBottom: "1px solid #555",
                  }}
                >
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerScores.map((player) => (
                <TableRow
                  key={player.userId}
                  sx={{
                    bgcolor:
                      player.rank === 1
                        ? "rgba(255, 215, 0, 0.1)"
                        : "transparent",
                  }}
                >
                  <TableCell
                    sx={{ color: "white", borderBottom: "1px solid #555" }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body1"
                        fontWeight={player.rank <= 3 ? "bold" : "normal"}
                        sx={{
                          color:
                            player.rank === 1
                              ? "#ffd700"
                              : player.rank === 2
                                ? "#c0c0c0"
                                : player.rank === 3
                                  ? "#cd7f32"
                                  : "white",
                        }}
                      >
                        {player.rank}
                      </Typography>
                      {player.rank === 1 && (
                        <TrophyIcon sx={{ color: "#ffd700", fontSize: 20 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", borderBottom: "1px solid #555" }}
                  >
                    {player.displayName}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", borderBottom: "1px solid #555" }}
                  >
                    <Chip
                      label={player.score}
                      size="small"
                      sx={{
                        bgcolor: player.rank === 1 ? "#ffd700" : "#90ee90",
                        color: "#000",
                        fontWeight: "bold",
                        border: "1px solid #333",
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {playerScores.length === 0 && (
          <Typography variant="body1" color="#999" textAlign="center" py={4}>
            No players to display
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

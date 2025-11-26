// additional search components for conversation history display and reply handling
"use client";
import { useState } from "react";
import { Box, Typography, Paper, List } from "@mui/material";
import SearchBar from "@/app/components/search/search-bar.jsx";
import { useSearchContext } from "@/context/search-context.jsx";

export default function Conversation() {
  const { conversationHistory } = useSearchContext();
  return (
    <Box
      component={Paper}
      elevation={4}
      sx={{
        bgcolor: "#2e2d2d",
        color: "white",
        width: "100%",
        p: 2,
        mb: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Conversation History
      </Typography>
      <List>
        {conversationHistory.map((entry) => (
          <Typography key={entry.id} variant="body2" color="white">
            <b>{entry.role}:</b> {entry.content} | Tracks:{" "}
            {entry.tracks[0]?.name || "None"}
          </Typography>
        ))}
      </List>
    </Box>
  );
}

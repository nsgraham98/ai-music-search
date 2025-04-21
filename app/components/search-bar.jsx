"use client";

import React, { useState } from "react";
import { useAudioPlayerContext } from "@/context/audio-player-context"; // import this from the context
import { TextField, Button, Box, CircularProgress } from "@mui/material";

const SearchBar = () => {
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { setTracks } = useAudioPlayerContext(); // import this from the context

  // sends a POST request with the user's query to the OpenAI API route
  async function handleSearch() {
    if (!userQuery) return;
    setIsLoading(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userQuery }), // sends query as a JSON object e.g. { userQuery: "query text here" }
    });

    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      setIsLoading(false);
      return;
    }

    const data = await response.json();

    setTracks(data.jamendoResponse); // set the tracks in the context
    const aiResponse = data.aiResponse; // get the AI response

    setIsLoading(false);
  }

  return (
    <Box display="flex" gap={2} alignItems="center" px={2}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by title, genre, mood..."
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        sx={{
          input: { color: "white" },
          fieldset: { borderColor: "#444" },
          bgcolor: "#2e2d2d",
        }}
      />

      <Button
        onClick={handleSearch}
        variant="contained"
        sx={{
          bgcolor: "#f50",
          "&:hover": { bgcolor: "#d04000" },
          color: "white",
          minWidth: 100,
          px: 3,
          py: 1.5,
        }}
        disabled={isLoading}
      >
        {/* Conditionally show "Search" or a loading spinner */}
        {!isLoading ? "Search" : <CircularProgress size={20} color="inherit" />}
      </Button>
    </Box>
  );
};

export default SearchBar;

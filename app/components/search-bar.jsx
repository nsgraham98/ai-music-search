"use client";

import React, { useState } from "react";
import { useAudioPlayerContext } from "@/context/audio-player-context"; // import this from the context
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

const SearchBar = () => {
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [aiResponse, setAiResponse] = useState(null); // state to hold AI response
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
    setAiResponse(data.aiResponse.output_text); // set the AI response in the state
    const aiResponse = data.aiResponse; // get the AI response

    setIsLoading(false);
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        gap={3}
        alignItems="center"
        justifyContent="flex-start" // for horizontal spacing
        px={0}
        sx={{
          width: "100%", // full width of parent
          maxWidth: "1200px", // optional: control how wide you want it
          mx: "auto", // center the box horizontally
        }}
      >
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
            bgcolor: "#E03FD8",
            "&:hover": { bgcolor: "#c133b9" }, // slightly darker for hover
            color: "white",
            minWidth: 100,
            maxWidth: 200,
            py: 1.5,
            ml: "auto",
          }}
          disabled={isLoading}
        >
          {/* Conditionally show "Search" or a loading spinner */}
          {!isLoading ? (
            "Search"
          ) : (
            <CircularProgress size={20} color="primary" />
          )}
        </Button>
      </Box>
      {/* AI Response */}
      <Box
        alignContent={"flex-start"}
        mt={2}
        px={2}
        sx={{
          width: "100%", // full width of parent
          mx: "auto",
          bgcolor: "#2e2d2d",
          borderRadius: 2,
          p: 2,
          minHeight: "55px",
        }}
      >
        <Typography>{isLoading ? "Thinking..." : aiResponse}</Typography>
      </Box>
    </Box>
  );
};

export default SearchBar;

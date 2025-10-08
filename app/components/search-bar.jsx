// SearchBar component with MUI styling and loading state
// sends user query to OpenAI API route (app/api/openai/route.js) and displays AI response

// This is the where the front end meets the backend for the main functionality of the app

"use client";

import React, { useState } from "react";
import {
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import { Search } from "lucide-react";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import { useUserAuth } from "@/context/auth-context";

const SearchBar = () => {
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [royaltyFree, setRoyaltyFree] = useState(true);
  const [error, setError] = useState(null);
  const { setTracks } = useAudioPlayerContext();
  const { user } = useUserAuth();

  async function handleSearch() {
    if (!userQuery.trim()) {
      setError("Please enter a search query");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userQuery, royaltyFree }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTracks(data.jamendoResponse || []);
      setAiResponse(data.aiResponse?.output_text || "Search completed");
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search. Please try again.");
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Search Input Row */}
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        sx={{
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for music by title, genre, mood, or artist..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              bgcolor: "#2e2d2d",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": {
                borderColor: "#E03FD8",
                borderWidth: "2px",
              },
              "&.Mui-disabled": {
                bgcolor: "#1a1a1a",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#888",
              opacity: 1,
            },
          }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={royaltyFree}
              onChange={(e) => setRoyaltyFree(e.target.checked)}
              disabled={isLoading}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#E03FD8",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: "#E03FD8",
                },
              }}
            />
          }
          label="Royalty-Free"
          sx={{
            color: "white",
            whiteSpace: "nowrap",
            m: 0,
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={royaltyFree}
              onChange={(e) => setRoyaltyFree(e.target.checked)}
              color="primary"
            />
          }
          label="Royalty-Free"
          sx={{ color: "white" }}
        />

        <Button
          onClick={handleSearch}
          variant="contained"
          disabled={isLoading || !userQuery.trim()}
          startIcon={!isLoading && <Search size={20} />}
          sx={{
            bgcolor: "#E03FD8",
            "&:hover": {
              bgcolor: "#c133b9",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(224, 63, 216, 0.4)",
            },
            "&:disabled": {
              bgcolor: "#666",
              color: "#999",
            },
            color: "white",
            minWidth: 120,
            py: 1.5,
            px: 3,
            transition: "all 0.2s",
            fontWeight: "bold",
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Search"
          )}
        </Button>
      </Box>

      {/* Error Message */}
      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{
            bgcolor: "#3d1a1a",
            color: "#ff6b6b",
            "& .MuiAlert-icon": { color: "#ff6b6b" },
          }}
        >
          {error}
        </Alert>
      </Collapse>

      {/* AI Response Box */}
      <Box
        sx={{
          bgcolor: "#2e2d2d",
          borderRadius: 2,
          p: 2.5,
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          border: "1px solid #444",
          transition: "border-color 0.3s",
          "&:hover": {
            borderColor: isLoading || aiResponse ? "#E03FD8" : "#444",
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: isLoading ? "#888" : "white",
            fontStyle: !aiResponse && !isLoading ? "italic" : "normal",
          }}
        >
          {isLoading
            ? "🎵 Searching for the perfect tracks..."
            : aiResponse || "Enter a search query to find music"}
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchBar;

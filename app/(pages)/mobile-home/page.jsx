// MOBILE-OPTIMIZED HOME PAGE
// Better spacing and layout for mobile devices

"use client";
import SearchBar from "@/app/components/search-bar.jsx";
import { Box, Typography, Paper } from "@mui/material";
import { TrackList } from "@/app/components/audio/track-list.jsx";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import { useSearchContext } from "@/context/search-context.jsx";
import { useMemo } from "react";

export default function HomePage() {
  const { searchResults } = useSearchContext();

  // Build a stable key based on current results
  const trackListKey = useMemo(
    () => searchResults.map((track) => track.id ?? "").join(","),
    [searchResults]
  );

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 0, sm: 1, md: 2 }, // No extra padding on mobile
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "100%" }}>
          <SearchBar />
        </Box>
      </Box>

      {/* Playlist (search results) */}
      <Box
        component={Paper}
        elevation={4}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          minHeight: "100%",
          mx: "auto",
          p: { xs: 1, sm: 2, md: 4 },
          borderRadius: 2,
          gap: 3,
        }}
      >
        {/* Inner playlist box */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {searchResults.length === 0 ? (
            <Paper
              elevation={3}
              sx={{
                bgcolor: "#4c4848",
                color: "white",
                borderRadius: 2,
                width: "100%",
                maxWidth: 900,
                mx: "auto",
                p: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Please search again.
              </Typography>
            </Paper>
          ) : (
            <TrackList
              key={trackListKey}
              variant="search"
              showDownload={true}
              showAddButton={true}
              showDeleteButton={false}
              tracks={searchResults}
              clearOnUnmount={true}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

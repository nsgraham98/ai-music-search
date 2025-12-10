// HOME PAGE (DASHBOARD)
// Only shown to logged in users, otherwise login popup is shown
// AudioPlayer component is located in the layout.jsx file so it's always visible to logged in users
"use client";
import SearchBar from "@/app/components/search/search-bar.jsx";
import { Box, Typography, Paper, List } from "@mui/material";
import { TrackList } from "@/app/components/audio/track-list.jsx";
import { useSearchContext } from "@/context/search-context.jsx";
import { useMemo } from "react";

export default function HomePage() {
  const { searchResults, conversationHistory, userQuery } = useSearchContext();

  // Build a stable key based on current results, so that the TrackList remounts when results change
  const trackListKey = useMemo(
    () => searchResults.map((track) => track.id ?? "").join(","),
    [searchResults]
  );

  return (
    <>
      {/* debug info */}
      {/* <Typography variant="h3" color="white" gutterBottom>
        {userQuery
          ? `Search Results for: "${userQuery}"`
          : "Welcome to AI Music Search"}
      </Typography>
      <Typography variant="h4" color="white" gutterBottom>
        Conversation History
      </Typography>
      <List>
        {conversationHistory.map((entry) => (
          <Typography key={entry.id} variant="body2" color="white">
            <b>{entry.role}:</b> {entry.content} | Tracks:{" "}
            {entry.tracks[0]?.name || "None"}
          </Typography>
        ))}
      </List> */}
      {/* end debug info */}

      {/* Search Bar */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          display: "flex",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "100%" }}>
          <SearchBar />
        </Box>
      </Box>
      {/* Playlist (aka search results) */}
      {/* Outer playlist box */}
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
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          // flexGrow: 1,
          // display: "flex",
          // flexDirection: "column",
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
                // maxHeight: "18rem",
                overflowY: "auto",
                borderRadius: 2,
                width: "100%", // add this
                maxWidth: 900, // adjust this width to make it wider
                mx: "auto", // optional: centers it horizontally
              }}
            >
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                p={2}
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
    </>
  );
}

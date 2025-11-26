"use client";

import { Button, Paper, Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

export default function PlaylistsPopup({
  open,
  playlists, // object: { [id]: name }
  onSelectPlaylist, // (playlistId) => void
  onClose, // () => void
  style, // optional extra style overrides
}) {
  const scrollRef = useRef(null); // for scrolling container
  const popupRef = useRef(null); // for detecting outside clicks

  // Always scroll to top when popup opens
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [open]);

  // Close popup when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  if (!playlists || Object.keys(playlists).length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          zIndex: 1000,
          p: 2,
          ...style,
        }}
        ref={popupRef}
      >
        <Typography variant="body2">No playlists available.</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        backgroundColor: "#2e2d2d",
        zIndex: 1000,
        p: 1,
        width: 200,
        maxHeight: 250,
        overflowY: "auto", // scroll bar
        borderRadius: 1,
        ...style,
      }}
      ref={(node) => {
        popupRef.current = node;
        scrollRef.current = node; // same element handles scroll
      }}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        {Object.entries(playlists).map(([id, name]) => (
          <Button
            key={id}
            onClick={() => {
              onSelectPlaylist?.(id);
              onClose?.();
            }}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              {name}
            </Typography>
          </Button>
        ))}
      </Box>
    </Paper>
  );
}

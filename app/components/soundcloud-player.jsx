// SoundCloud Player Component
// Embeds SoundCloud widget for playback

"use client";

import React from "react";
import { Box } from "@mui/material";
import { createSoundCloudWidget } from "@/lib/soundcloud-utils";

export default function SoundCloudPlayer({ url, compact = false }) {
  if (!url) return null;

  const widgetUrl = createSoundCloudWidget(url, {
    autoPlay: false,
    hideRelated: true,
    showComments: false,
    showUser: true,
    showReposts: false,
    visual: false,
    color: "E03FD8",
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: compact ? "120px" : "166px",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={widgetUrl}
        style={{
          border: "none",
          borderRadius: "4px",
        }}
      />
    </Box>
  );
}

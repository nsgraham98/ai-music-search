// A reusable download button component for audio tracks
// used in audio-player.jsx

"use client";

import { Button, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
export const DownloadButton = ({
  // these attributes are part of each track obj returned from Jamendo API
  downloadUrl,
  filename = "track.mp3", // default filename if none provided
  downloadAllowed = false,
}) => {
  if (!downloadAllowed) {
    return (
      <Button
        variant="outlined"
        size="medium"
        disabled
        sx={{ cursor: "not-allowed" }}
      >
        Unavailable
      </Button>
    );
  } else {
    return (
      <>
        <Button
          component="a"
          onClick={(e) => {
            e.stopPropagation();
          }}
          href={downloadUrl}
          download={filename}
          target="_blank"
          rel="noopener noreferrer"
          size="medium"
          sx={{
            transition: "all 0.1s ease-in-out", // Force all transitions
            "&:hover": {
              color: "#E03FD8",
              borderColor: "#E03FD8",
            },
            "& .MuiButton-label": {
              transition: "inherit", // just in case, applies transition to inner span
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", color: "white", mr: 0.5 }}
          >
            Download
          </Typography>
          <DownloadIcon sx={{ color: "white" }} />
        </Button>
      </>
    );
  }
};

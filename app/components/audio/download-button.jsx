"use client";

import { Button } from "@mui/material";

// A reusable download button that checks for permissions
export const DownloadButton = ({
  downloadUrl,
  filename = "track.mp3",
  downloadAllowed = false,
}) => {
  // const { currentTrack } = useAudioPlayerContext();
  // const isDownloadLinkValid = !!downloadUrl && downloadUrl.startsWith("http");
  // const isDownloadPermitted = downloadAllowed === true;
  // if (!downloadUrl || !downloadAllowed) {
  //   console.warn("Download button not shown:", {
  //     downloadUrl,
  //     downloadAllowed,
  //   });
  //   return null; // Don't render if not allowed or no URL
  // }
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
      <Button
        component="a"
        href={downloadUrl}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        size="medium"
        variant="outlined"
        sx={{
          color: "white",
          borderColor: "#888",
          transition: "all 0.1s ease-in-out", // ✅ Force all transitions
          "&:hover": {
            color: "#E03FD8",
            borderColor: "#E03FD8",
          },
          "& .MuiButton-label": {
            transition: "inherit", // just in case, applies transition to inner span
          },
        }}
      >
        Download
      </Button>
    );
  }
};

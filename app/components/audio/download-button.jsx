"use client";

import { Button } from "@mui/material";

// A reusable download button that checks for permissions
export const DownloadButton = ({
  downloadUrl,
  filename = "track.mp3",
  downloadAllowed = false,
}) => {
  const isDownloadLinkValid = !!downloadUrl && downloadUrl.startsWith("http");
  const isDownloadPermitted = downloadAllowed === true;
  if (!downloadUrl || !downloadAllowed) {
    console.warn("Download button not shown:", {
      downloadUrl,
      downloadAllowed,
    });
    return null; // Don't render if not allowed or no URL
  }

  return (
    <Button
      component="a"
      href={downloadUrl}
      download={filename}
      target="_blank"
      rel="noopener noreferrer"
      variant="outlined"
      color="primary"
      size="small"
      sx={{ mt: 1 }}
    >
      Download
    </Button>
  );
};

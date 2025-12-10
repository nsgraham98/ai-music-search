// hamburger menu for each track in the tracklist
// holds buttons for adding/removing from playlist, downloading, etc.
"use client";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";

import { Box } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
// components
import { AddTrackToPlaylistButton } from "@/app/components/playlist/add-track-to-playlist.jsx";
import { DeleteTrackFromPlaylistButton } from "@/app/components/playlist/delete-track-from-playlist";
import { DownloadButton } from "@/app/components/audio/download-button.jsx";

export default function TracklistMenu({
  track = {},
  playlistId = "",
  showAddButton = true,
  showDeleteButton = true,
  showDownload = true,
}) {
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open) setOpen(false);
      }}
    >
      <Box
        onMouseEnter={() => track && setOpen(true)}
        onMouseLeave={() => track && setOpen(false)}
        // Mobile tap
        {...(isTouch && {
          onClick: () => setOpen((prev) => !prev),
        })}
      >
        {!open && <MenuIcon sx={{ color: "white" }} />}
        {open && track && (
          <Box
            display={open ? "flex" : "none"}
            alignItems="flex-end"
            gap={1}
            padding={1}
            flexDirection="column"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            sx={{
              cursor: "pointer",
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
              zIndex: 10,
              borderWidth: 1,
              borderColor: open ? "grey.700" : "transparent",
              borderRadius: 1,
              bgcolor: open ? "rgba(0,0,0,0.7)" : "transparent",
              transition: "background-color 0.2s, border-color 0.2s",
            }}
          >
            {/* display buttons conditionally based on 'open' state */}
            {showAddButton && <AddTrackToPlaylistButton trackId={track.id} />}
            {showDeleteButton && (
              <DeleteTrackFromPlaylistButton
                trackId={track.id}
                playlistId={playlistId}
              />
            )}
            {showDownload && (
              <DownloadButton
                downloadUrl={track.audiodownload}
                downloadAllowed={track.audiodownload_allowed}
                filename={`${track.name}.mp3`}
              />
            )}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}

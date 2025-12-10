// Component for the audio player UI at the bottom of the screen
// Present on every page after login (i.e. within the dashboard layout)
// Used in /app/(pages)/(home)/layout.jsx

// Contains subcomponents for:
// track info
// playback controls
// progress bar
// volume control
// Hamburger menu

"use client";

import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  TrackInfo,
  handleAlbumOnClick,
  handleTrackOnClick,
  handleArtistOnClick,
} from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import TracklistMenu from "@/app/components/audio/track-list-menu";
import placeholderArt from "@/public/images/albumart-placeholder.webp";

// import { AddTrackToPlaylistButton } from "../playlist/add-track-to-playlist";
// import { DeleteTrackFromPlaylistButton } from "../playlist/delete-track-from-playlist";

export const AudioPlayer = () => {
  const { currentTrack, isMinimized, setIsMinimized } = useAudioPlayerContext();
  const theme = useTheme();

  // Detect mobile and tablet breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // > 900px

  // Mobile Layout (Stacked Vertically)
  if (isMobile) {
    return (
      <Box
        className="audio-player"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#2e2d2d",
          borderTop: "1px solid #444",
          zIndex: 1000,
          width: "100%",
          maxWidth: "100vw", // 🔑 never wider than viewport
          px: 1,
          py: 1,
          display: "flex",
          flexDirection: "row",
          gap: 1,
          isolation: "isolate",
          overflow: "hidden", // 🔑 hide any tiny overflow
          ".light-mode &": {
            bgcolor: "#ffffff",
            borderTop: "1px solid #cccccc",
            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          },
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
          px: 1.5,
        }}
      >
        {/* Wrapper for avatar + column 2 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Column 1: Avatar */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxWidth: 80,
              maxHeight: "100%",
              mx: 0.5,
              flexShrink: 0,
            }}
          >
            <Avatar
              src={
                currentTrack
                  ? currentTrack.image || placeholderArt
                  : placeholderArt
              }
              variant="rounded"
              sx={{
                width: 80,
                height: 80,
                bgcolor: "grey.500",
                flexShrink: 0,
                cursor: "pointer",
              }}
              // onClick={() => handleAlbumOnClick(currentTrack)}
            />

            <Typography
              variant="subtitle2"
              color="white"
              noWrap
              sx={{
                cursor: "pointer",
                color: "white",
                transition: "color 0.1s",
                "&:hover": { color: "#E03FD8" },
              }}
              // onClick={() => handleArtistOnClick(currentTrack)}
            >
              {currentTrack ? currentTrack.artist_name : ""}
            </Typography>
          </Box>

          {/* Column 2: text + controls */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              flexShrink: 1,
              minWidth: 0,
              // overflow: "hidden",
            }}
          >
            {/* Text Info */}
            {/* Text Info */}
            {currentTrack && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                {/* Title wrapper – the only thing that shrinks */}
                <Box
                  sx={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    sx={{
                      cursor: "pointer",
                      color: "white",
                      transition: "color 0.1s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "&:hover": { color: "#E03FD8" },
                    }}
                  >
                    {currentTrack.name}
                  </Typography>
                </Box>

                {currentTrack?.audiodownload_allowed && (
                  <Box
                    sx={{
                      flexShrink: 0,
                      ml: 0.5,
                    }}
                  >
                    <TracklistMenu
                      track={currentTrack}
                      showAddButton={true}
                      showDeleteButton={false}
                      showDownload={true}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Progress Bar */}
            <Box sx={{ width: "100%", flexShrink: 1, my: 0.5 }}>
              <ProgressBar />
            </Box>

            {/* Row with controls + menu */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                width: "100%",
                minWidth: 0,
              }}
            >
              {/* Controls (flexbox is within component) */}
              <Controls isMobile={true} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Tablet Layout (Larger version of Mobile layout)
  if (isTablet) {
    return (
      <Box
        className="audio-player"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#2e2d2d",
          borderTop: "1px solid #444",
          zIndex: 1000,
          width: "100%",
          maxWidth: "100vw",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          isolation: "isolate",
          overflow: "hidden",
          ".light-mode &": {
            bgcolor: "#ffffff",
            borderTop: "1px solid #cccccc",
            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          },
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Wrapper for avatar + column 2*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Column 1: Avatar (bigger on tablet) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              maxWidth: 120,
              flexShrink: 0,
            }}
          >
            <Avatar
              src={
                currentTrack
                  ? currentTrack.image || placeholderArt
                  : placeholderArt
              }
              variant="rounded"
              sx={{
                width: 120,
                height: 120,
                bgcolor: "grey.500",
                flexShrink: 0,
                cursor: currentTrack ? "pointer" : "default",
              }}
              // onClick={() => currentTrack && handleAlbumOnClick(currentTrack)}
            />

            {/* Artist name */}
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                cursor: currentTrack ? "pointer" : "default",
                color: "white",
                fontSize: "0.9rem",
                "&:hover": currentTrack ? { color: "#E03FD8" } : {},
              }}
              // onClick={() => currentTrack && handleArtistOnClick(currentTrack)}
            >
              {currentTrack ? currentTrack.artist_name : ""}
            </Typography>
          </Box>

          {/* Column 2: text + controls, larger for tablet */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {/* Track title + download menu */}
            {currentTrack && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                {/* Title wrapper */}
                <Box
                  sx={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      cursor: "pointer",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "&:hover": { color: "#E03FD8" },
                    }}
                    // onClick={() => handleTrackOnClick(currentTrack)}
                  >
                    {currentTrack.name}
                  </Typography>
                </Box>

                {currentTrack?.audiodownload_allowed && (
                  <Box
                    sx={{
                      flexShrink: 0,
                      ml: 0.5,
                    }}
                  >
                    <TracklistMenu
                      track={currentTrack}
                      showAddButton={true}
                      showDeleteButton={false}
                      showDownload={true}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Progress Bar (slightly larger spacing) */}
            <Box sx={{ width: "100%", flexShrink: 1, my: 1 }}>
              <ProgressBar />
            </Box>

            {/* Controls row (tablet sizing) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Controls isMobile={false} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop Layout (Default)
  return (
    <Box
      className="audio-player"
      sx={{
        position: "fixed",
        bottom: 0,
        // bgcolor: "#2e2d2d",
        bgcolor: "#2e2d2d",
        borderTop: "1px solid #444",
        zIndex: 100,
        width: "100%",
        px: 2,
        py: isMinimized ? 0.5 : 1.5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: isMinimized ? "auto" : "5vw",
        isolation: "isolate",
        ".light-mode &": {
          bgcolor: "#ffffff",
          borderTop: "1px solid #cccccc",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
        },
        maxHeight: isMinimized ? "48px" : "none",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Minimize/Expand Button */}
      <IconButton
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? "Show audio player" : "Hide audio player"}
        sx={{
          color: "#ccc",
          transition: "all 0.2s",
          "&:hover": {
            color: "#E03FD8",
            transform: "scale(1.1)",
          },
        }}
        size="small"
      >
        {isMinimized ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>

      {/* Left - Track Info */}
      <Box
        sx={{
          width: isMinimized ? "0" : "25%",
          maxWidth: isMinimized ? "0" : "25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          ml: isMinimized ? 0 : 2,
          opacity: isMinimized ? 0 : 1,
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        <TrackInfo />
      </Box>

      {/* Middle */}
      {!isMinimized && (
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Box width="100%" mb={1}>
            <ProgressBar />
          </Box>
          <Box display="flex" alignItems="center" width="100%">
            <Box flex={1} />
            <Box flex={1} display="flex" justifyContent="center">
              <Controls />
            </Box>
            <Box flex={1} display="flex" justifyContent="flex-end"></Box>
          </Box>
        </Box>
      )}

      {/* Right */}
      <Box
        sx={{
          width: "25%",
          maxWidth: "25%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          mr: 2,
        }}
      >
        <VolumeControl />
        <TracklistMenu
          track={currentTrack}
          showAddButton={true}
          showDeleteButton={false}
          showDownload={true}
        />
        {/* <AddTrackToPlaylistButton trackId={currentTrack?.id} />
        <DeleteTrackFromPlaylistButton trackId={currentTrack?.id} /> */}
      </Box>
    </Box>
  );
};

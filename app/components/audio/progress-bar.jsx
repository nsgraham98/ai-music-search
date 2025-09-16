// A progress bar component for the audio player on the bottom of the screen
// used in audio-player.jsx
// consumes context from audio-player-context.jsx

"use client";

import { Box, Typography } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const ProgressBar = () => {
  const { audioRef, progressBarRef, timeProgress, setTimeProgress, duration } =
    useAudioPlayerContext();

  // handle progress bar change - when user drags the progress bar thumb
  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);
      audioRef.current.currentTime = newTime;
      setTimeProgress(newTime);
      // if progress bar changes while audio is on pause
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(newTime / duration) * 100}%`
      );
    }
  };

  // format time in mm:ss format
  const formatTime = (time) => {
    if (typeof time === "number" && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(1, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return "00:00";
  };

  return (
    <Box display="flex" alignItems="center" gap={2} width="100%">
      {/* current time */}
      <Typography variant="caption" color="white">
        {formatTime(timeProgress)}
      </Typography>

      {/* simple HTML range input for progress bar */}
      <input
        className="max-w-[80%] bg-gray-300"
        ref={progressBarRef}
        type="range"
        defaultValue="0"
        onChange={handleProgressChange}
      />

      {/* total track duration */}
      <Typography variant="caption" color="white">
        {formatTime(duration)}
      </Typography>
    </Box>
  );
};

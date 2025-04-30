"use client";

import { Box, Typography, Slider } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const ProgressBar = () => {
  const { audioRef, progressBarRef, timeProgress, setTimeProgress, duration } =
    useAudioPlayerContext();

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
      <Typography variant="caption" color="white">
        {formatTime(timeProgress)}
      </Typography>

      <input
        className="max-w-[80%] bg-gray-300"
        ref={progressBarRef}
        type="range"
        defaultValue="0"
        onChange={handleProgressChange}
      />

      <Typography variant="caption" color="white">
        {formatTime(duration)}
      </Typography>
    </Box>
  );
};

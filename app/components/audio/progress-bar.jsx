"use client";

import { Box, Typography, Slider } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const ProgressBar = () => {
  const { audioRef, progressBarRef, timeProgress, setTimeProgress, duration } =
    useAudioPlayerContext();

  const handleSliderChange = (_, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setTimeProgress(newValue);
    }
  };

  const formatTime = (time) => {
    if (typeof time === "number" && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return "00:00";
  };

  return (
    <Box display="flex" alignItems="center" gap={2} width="100%">
      <Typography variant="caption">{formatTime(timeProgress)}</Typography>

      <Slider
        ref={progressBarRef}
        value={timeProgress}
        onChange={handleSliderChange}
        max={duration}
        sx={{
          flexGrow: 1,
          color: "primary.main",
          "& .MuiSlider-thumb": {
            width: 12,
            height: 12,
          },
        }}
      />

      <Typography variant="caption">{formatTime(duration)}</Typography>
    </Box>
  );
};

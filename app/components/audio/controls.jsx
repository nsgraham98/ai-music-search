// https://blog.logrocket.com/building-audio-player-react/

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsFillFastForwardFill,
  BsFillRewindFill,
  BsRepeat,
  BsShuffle,
} from "react-icons/bs";

import { Box, IconButton, Typography } from "@mui/material";
import { useAudioPlayerContext } from "@/context/audio-player-context";

export const Controls = () => {
  const {
    currentTrack,
    audioRef,
    setTrackIndex,
    setCurrentTrack,
    setDuration,
    duration,
    setTimeProgress,
    progressBarRef,
    isPlaying,
    setIsPlaying,
    tracks,
  } = useAudioPlayerContext();

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const playAnimationRef = useRef(null);

  const lastUpdateRef = useRef(0); // to track the last update time

  // updates currentTime & progress bar position
  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;

      const now = Date.now();
      if (now - lastUpdateRef.current > 200) {
        lastUpdateRef.current = now;
        setTimeProgress(currentTime);
      } // skip if less than 1 second has passed

      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  // animation frame loop that continuously updates the progress bar
  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  // ensures audio plays or pauses based on the "isPlaying" state
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress(); // ensure progress is updated immediately when paused
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  // displaying track duration as soon as the audio is loaded
  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  // skip 15s forward
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      updateProgress(); // update progress immediately after skipping
    }
  };

  // skip 15s backward
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress(); // update progress immediately after skipping
    }
  };

  // skip to previous track (random if shuffle is on)
  const handlePrevious = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev === 0
          ? tracks.length - 1
          : prev - 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  // skip to next track (random if shuffle is on)
  const handleNext = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev >= tracks.length - 1
          ? 0
          : prev + 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  // when track ends: repeat or skip to next
  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (isRepeat) {
          currentAudioRef.play();
        } else {
          handleNext();
        }
      };
    }
    return () => {
      if (currentAudioRef) {
        currentAudioRef.onended = null; // clean up
      }
    };
  }, [isRepeat, handleNext, audioRef]);

  // // fallback if track isn't loaded
  // if (!currentTrack) {
  //   return (
  //     <Typography variant="body2" color="text.secondary">
  //       No track selected
  //     </Typography>
  //   );
  // }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* Audio Element */}
      <audio
        src={currentTrack?.audio}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* Repeat */}
      <IconButton onClick={() => setIsRepeat((prev) => !prev)}>
        <BsRepeat size={14} color={isRepeat ? "#f50" : "white"} />
      </IconButton>

      {/* Previous Track */}
      <IconButton onClick={handlePrevious}>
        <BsSkipStartFill size={20} color="white" />
      </IconButton>

      {/* Skip Backward */}
      <IconButton onClick={skipBackward}>
        <BsFillRewindFill size={20} color="white" />
      </IconButton>

      {/* Play / Pause */}
      <IconButton onClick={() => setIsPlaying((prev) => !prev)} sx={{ mx: 1 }}>
        {isPlaying ? (
          <BsFillPauseFill size={40} color="white" />
        ) : (
          <BsFillPlayFill size={40} color="white" />
        )}
      </IconButton>

      {/* Skip Forward */}
      <IconButton onClick={skipForward}>
        <BsFillFastForwardFill size={20} color="white" />
      </IconButton>

      {/* Next Track */}
      <IconButton onClick={handleNext}>
        <BsSkipEndFill size={20} color="white" />
      </IconButton>

      {/* Shuffle */}
      <IconButton onClick={() => setIsShuffle((prev) => !prev)}>
        <BsShuffle size={14} color={isShuffle ? "#f50" : "white"} />
      </IconButton>
    </Box>
  );
};

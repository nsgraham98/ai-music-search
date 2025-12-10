// Audio player controls component
// Play, pause, skip, rewind, fast-forward, shuffle, repeat
// Followed this tutorial: https://blog.logrocket.com/building-audio-player-react/
// This consumes context from audio-player-context.jsx

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

export const Controls = ({ isMobile = false }) => {
  const {
    currentTrack,
    audioRef, // ref for the <audio> element
    setTrackIndex,
    setCurrentTrack,
    setDuration,
    duration,
    setTimeProgress,
    progressBarRef,
    isPlaying,
    setIsPlaying,
    currentPlaylist,
  } = useAudioPlayerContext();

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  // useRef is used to persist values between renders without causing re-renders
  const playAnimationRef = useRef(null); // used for progress bar animation
  const lastUpdateRef = useRef(0); // to track the last update time

  // updates currentTime & progress bar position
  // useCallback is used to memoize the function and avoid unnecessary re-renders
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
  }, [isPlaying, startAnimation, updateProgress, audioRef]); // dependencies

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
      updateProgress();
    }
  };

  // skip 15s backward
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress();
    }
  };

  // skip to previous track (random if shuffle is on)
  const handlePrevious = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * currentPlaylist.tracks.length)
        : prev === 0
          ? currentPlaylist.tracks.length - 1
          : prev - 1;
      setCurrentTrack(currentPlaylist.tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, currentPlaylist]);

  // skip to next track (random if shuffle is on)
  const handleNext = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * currentPlaylist.tracks.length)
        : prev >= currentPlaylist.tracks.length - 1
          ? 0
          : prev + 1;
      setCurrentTrack(currentPlaylist.tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, currentPlaylist]);

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
  }, [isRepeat, handleNext, audioRef]); // dependencies

  return (
    <>
      {/* Audio Element */}
      <audio
        src={currentTrack?.audio}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        style={{ display: "none" }}
      />
      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: {
            xs: 260, // phones
            sm: 300, // small tablets
            md: 500, // larger tablets / small desktop
            lg: 700, // desktop
            xl: 900, // large desktop
          },
          gap: {
            xs: 0.5, // 4px
            sm: 0.5, // 8px
            md: 1.5, // 12px
            lg: 2, // 16px
            xl: 2.5, // 20px
          },
          mx: "auto",
        }}
      >
        {/* Repeat */}
        <IconButton onClick={() => setIsRepeat((prev) => !prev)}>
          <BsRepeat size={14} color={isRepeat ? "#f50" : ""} />
        </IconButton>

        {/* Previous Track */}
        <IconButton onClick={handlePrevious}>
          <BsSkipStartFill size={20} />
        </IconButton>

        {/* Skip Backward */}
        {!isMobile && (
          <IconButton onClick={skipBackward}>
            <BsFillRewindFill size={20} />
          </IconButton>
        )}

        {/* Play / Pause */}
        <IconButton
          onClick={() => setIsPlaying((prev) => !prev)}
          sx={{ mx: 1 }}
        >
          {isPlaying ? (
            <BsFillPauseFill size={40} />
          ) : (
            <BsFillPlayFill size={40} />
          )}
        </IconButton>

        {/* Skip Forward */}
        {!isMobile && (
          <IconButton onClick={skipForward}>
            <BsFillFastForwardFill size={20} />
          </IconButton>
        )}

        {/* Next Track */}
        <IconButton onClick={handleNext}>
          <BsSkipEndFill size={20} />
        </IconButton>

        {/* Shuffle */}
        <IconButton onClick={() => setIsShuffle((prev) => !prev)}>
          <BsShuffle size={14} color={isShuffle ? "#f50" : ""} />
        </IconButton>
      </Box>
    </>
  );
};

"use client";

import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { PlayList } from "./playlist";
import { Box } from "@mui/material";

export const AudioPlayer = () => {
  return (
    <div>
      <div className="min-h-32 bg-[#2e2d2d] flex flex-col gap-9 lg:flex-row justify-between items-center text-white p-6 mx-auto w-full max-w-6xl rounded-lg">
        <Box p={2}>
          <TrackInfo />
        </Box>
      </div>

      <div>
        <Box p={2}>
          <PlayList />
        </Box>
        <div className="w-full flex flex-col items-center gap-1 m-auto flex-1">
          <ProgressBar />

          <div className="flex items-center gap-2 text-gray-400">
            <Box width="100%" px={2} py={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                width="100%"
                maxWidth="900px"
                mx="auto"
              >
                {/* Centered Controls */}
                <Box>
                  <Controls />
                </Box>

                {/* Right-aligned Volume */}
                <Box
                  position="absolute"
                  right={0}
                  top="50%"
                  sx={{ transform: "translateY(-50%)" }}
                >
                  <VolumeControl />
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

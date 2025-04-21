"use client";

import { Box, Grid, Container, Paper } from "@mui/material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { PlayList } from "./playlist";
import { Box } from "@mui/material";
import ResultCard from "../result-card"; // adjust path if needed

export const AudioPlayer = ({ results }) => {
  return (
    <div>
      <div className="min-h-8 bg-[#2e2d2d] flex flex-col gap-9 lg:flex-row justify-between items-center text-white p-[0.5rem_10px]">
        <TrackInfo />
        <div className="w-full flex flex-col items-center gap-1 m-auto flex-1">
          <Controls />
          <ProgressBar />
          <div className="flex items-center gap-2 text-gray-400">
            <VolumeControl />
          </div>
          <div>
            <PlayList />
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";
import { useState } from "react";
import { TrackInfo } from "./trackInfo.js";
import { Controls } from "./controls.js";
import { ProgressBar } from "./progressBar.js";

export const AudioPlayer = () => {
  // const handleOnClick = () => {
  //     // do something
  // };

  return (
    <div>
      <div className="min-h-8 bg-[#2e2d2d] flex flex-col gap-9 lg:flex-row justify-between items-center text-white p-[0.5rem_10px]">
        <TrackInfo />
        <div className="w-full flex flex-col items-center gap-1 m-auto flex-1">
          <Controls />
          <ProgressBar />
        </div>
      </div>
    </div>
  );
};

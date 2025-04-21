"use client";

import { Box, Grid, Container, Paper } from "@mui/material";
import { TrackInfo } from "./track-info";
import { Controls } from "./controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { PlayList } from "./playlist";
import ResultCard from "../result-card"; // adjust path if needed

export const AudioPlayer = ({ results }) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Result Cards Grid */}
      <Grid container spacing={4}>
        {results?.map((track, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <ResultCard
              title={track.name}
              artist={track.artist_name}
              albumImage={track.image}
              audioUrl={track.audio}
              description={track.album_name}
            />
          </Grid>
        ))}
      </Grid>

      {/* Audio Player Controls Section */}
      <Paper
        elevation={3}
        sx={{
          bgcolor: "#2e2d2d",
          color: "white",
          mt: 4,
          p: "0.5rem 10px",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <TrackInfo />

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          flex={1}
          gap={1}
        >
          <Controls />
          <ProgressBar />
          <Box display="flex" alignItems="center" gap={2} color="gray">
            <VolumeControl />
          </Box>
          <Box>
            <PlayList />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

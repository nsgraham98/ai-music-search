export default function AiResponseBox() {
  return (
    <Box
      sx={{
        bgcolor: "#2e2d2d",
        color: "white",
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        p: { xs: 2, md: 4 },
        borderRadius: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        AI Response:
      </Typography>
      <Typography variant="body1">{response}</Typography>
    </Box>
  );
}

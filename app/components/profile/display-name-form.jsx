"use client";
import { useState } from "react";
import { useUserAuth } from "@/context/auth-context";
import { Button, TextField, Box, Typography } from "@mui/material";

export default function DisplayNameForm() {
  const { user, updateDisplayName } = useUserAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateDisplayName(displayName);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 4,
      }}
    >
      <Typography variant="h6">Choose a display name</Typography>
      <TextField
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
      {success && (
        <Typography color="success.main">Display name updated!</Typography>
      )}
    </Box>
  );
}

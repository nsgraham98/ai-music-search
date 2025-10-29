"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

export default function UsernameEditor({ currentUsername, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setNewUsername(currentUsername);
  }, [currentUsername]);

  const handleSave = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setIsUpdating(true);
    setError("");

    const result = await onUpdate(newUsername);

    if (result.success) {
      setIsEditing(false);
    } else {
      setError(result.error || "Failed to update username");
    }

    setIsUpdating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(currentUsername);
    setError("");
  };

  return (
    <Box
      sx={{
        bgcolor: "#3a3a3a",
        p: 3,
        borderRadius: 2,
        border: "1px solid #444",
        mb: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        Username
      </Typography>
      {isEditing ? (
        <Box>
          <TextField
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            variant="outlined"
            placeholder="Enter new username"
            error={!!error}
            helperText={error}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                bgcolor: "#2e2d2d",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": {
                  borderColor: "#E03FD8",
                  borderWidth: "2px",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "#ff6b6b",
              },
            }}
          />
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isUpdating}
              sx={{
                bgcolor: "#E03FD8",
                "&:hover": {
                  bgcolor: "#c133b9",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(224, 63, 216, 0.4)",
                },
                transition: "all 0.2s",
                fontWeight: "bold",
              }}
            >
              {isUpdating ? <CircularProgress size={20} /> : "Save"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isUpdating}
              sx={{
                color: "#888",
                borderColor: "#444",
                "&:hover": {
                  borderColor: "#888",
                  bgcolor: "#2e2d2d",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontSize="1.1rem">
            {currentUsername}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsEditing(true)}
            sx={{
              color: "white",
              borderColor: "#444",
              "&:hover": {
                borderColor: "#E03FD8",
                color: "#E03FD8",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s",
            }}
          >
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
}

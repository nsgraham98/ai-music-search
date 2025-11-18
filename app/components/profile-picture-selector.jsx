"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Avatar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  PhotoCamera,
  Close as CloseIcon,
  CheckCircle,
} from "@mui/icons-material";

// Default avatar options
const DEFAULT_AVATARS = [
  { id: 1, emoji: "🎵", color: "#E03FD8" },
  { id: 2, emoji: "🎸", color: "#8B5CF6" },
  { id: 3, emoji: "🎹", color: "#3B82F6" },
  { id: 4, emoji: "🎤", color: "#F59E0B" },
  { id: 5, emoji: "🎧", color: "#10B981" },
  { id: 6, emoji: "🎺", color: "#EF4444" },
  { id: 7, emoji: "🎻", color: "#EC4899" },
  { id: 8, emoji: "🥁", color: "#14B8A6" },
  { id: 9, emoji: "🎷", color: "#8B5CF6" },
  { id: 10, emoji: "🪕", color: "#F97316" },
  { id: 11, emoji: "🪗", color: "#06B6D4" },
  { id: 12, emoji: "🎼", color: "#A855F7" },
];

export default function ProfilePictureSelector({
  open,
  onClose,
  onSelect,
  currentAvatar,
}) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setUploadedImage(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSelectedAvatar(null);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (tabValue === 0 && selectedAvatar) {
      onSelect({ type: "default", data: selectedAvatar });
      onClose();
    } else if (tabValue === 1 && uploadedImage) {
      onSelect({ type: "custom", data: uploadedImage });
      onClose();
    } else {
      setError("Please select or upload an avatar");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#2e2d2d",
          color: "white",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Choose Profile Picture
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            "& .MuiTab-root": { color: "#888" },
            "& .Mui-selected": { color: "#E03FD8" },
            "& .MuiTabs-indicator": { backgroundColor: "#E03FD8" },
          }}
        >
          <Tab label="Default Avatars" />
          <Tab label="Upload Custom" />
        </Tabs>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, bgcolor: "#3d1a1a", color: "#ff6b6b" }}
          >
            {error}
          </Alert>
        )}

        {tabValue === 0 && (
          <Grid container spacing={2}>
            {DEFAULT_AVATARS.map((avatar) => (
              <Grid item xs={3} key={avatar.id}>
                <Box
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: avatar.color,
                      fontSize: "2.5rem",
                      margin: "auto",
                      border:
                        selectedAvatar?.id === avatar.id
                          ? "3px solid #E03FD8"
                          : "none",
                    }}
                  >
                    {avatar.emoji}
                  </Avatar>
                  {selectedAvatar?.id === avatar.id && (
                    <CheckCircle
                      sx={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        color: "#E03FD8",
                        fontSize: "1.5rem",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {tabValue === 1 && (
          <Box textAlign="center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            {uploadedImage ? (
              <Box>
                <Avatar
                  src={uploadedImage}
                  sx={{
                    width: 150,
                    height: 150,
                    margin: "auto",
                    mb: 2,
                    border: "3px solid #E03FD8",
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    color: "white",
                    borderColor: "#888",
                    "&:hover": { borderColor: "#E03FD8" },
                  }}
                >
                  Change Image
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "2px dashed #888",
                  borderRadius: 2,
                  p: 4,
                  cursor: "pointer",
                  "&:hover": { borderColor: "#E03FD8" },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCamera sx={{ fontSize: 60, color: "#888", mb: 2 }} />
                <Typography variant="body1" color="#ccc">
                  Click to upload an image
                </Typography>
                <Typography variant="caption" color="#888">
                  Max size: 2MB
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "#888" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedAvatar && !uploadedImage}
          sx={{
            bgcolor: "#E03FD8",
            "&:hover": { bgcolor: "#c133b9" },
            "&:disabled": { bgcolor: "#666", color: "#999" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

"use client";
import { Snackbar, Alert } from "@mui/material";

export default function SnackbarComponent({
  open,
  message,
  severity = "success",
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={severity}
        sx={{
          bgcolor: severity === "success" ? "#1a3d1a" : "#3d1a1a",
          color: severity === "success" ? "#69ff6b" : "#ff6b6b",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

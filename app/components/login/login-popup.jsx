// The login popup dialog that appears when the user is not authenticated
// contains the LoginForm component
// uses auth-context.jsx to check if user is logged in

"use client";

import { useUserAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { LoginForm } from "@/app/components/login/login-form";

export default function LoginPopup() {
  const { user } = useUserAuth();
  // state to control dialog open/close
  const [open, setOpen] = useState(false);

  // open dialog if user is not logged in
  useEffect(() => {
    if (!user) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [user]);

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            bgcolor: "#1e1e1e",
            color: "white",
            borderRadius: 2, // You can adjust this if you want smoother or sharper corners
            p: 2,
          },
        },
      }}
    >
      <DialogTitle>
        <Typography fontSize={50} fontWeight="bold">
          TUTTi.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <LoginForm />
      </DialogContent>
      <DialogContent>
        <Typography fontSize={14} pb={1} textAlign="center">
          To use our free AI music searching app, please sign in with your
          Google or GitHub account.
        </Typography>
        <Typography
          fontSize={11}
          pt={1}
          px={6}
          textAlign="center"
          borderTop={1}
        >
          We require a login to ensure that you are a human user and not a bot.
          This prevents any unnecessary additional costs from our API provider.
          We do not store any of your data, and you can use the app for free.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

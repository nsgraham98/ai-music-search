"use client";
// The login form component with buttons for GitHub, Google, and Facebook sign-in
// enclosed in login-popup.jsx
// uses auth-context.jsx for authentication functions

import { Button, Box, Stack } from "@mui/material";
import { useUserAuth } from "/context/auth-context";

export function LoginForm() {
  const { gitHubSignIn, googleSignIn, facebookSignIn, signIn } = useUserAuth(); // get sign-in functions from context

  // Handlers for button clicks
  // Each handler calls the corresponding sign-in function (in auth-context) and catches errors
  const handleSignIn = async (providerName) => {
    try {
      await signIn(providerName);
    } catch (error) {
      console.error(`Error signing in with ${providerName}:`, error);
    }
  };
  const handleGitHubSignIn = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
    }
  };

  return (
    <Stack spacing={2} width="100%" maxWidth={300}>
      <Button
        type="button"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#24292e",
          "&:hover": { backgroundColor: "#1b1f23" },
        }}
        onClick={() => handleSignIn("github")}
      >
        Sign in with GitHub
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": { backgroundColor: "#1e498f" },
        }}
        onClick={() => handleSignIn("google")}
      >
        Sign in with Google
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": { backgroundColor: "#1e498f" },
        }}
        onClick={() => handleSignIn("facebook")}
      >
        Sign in with Facebook
      </Button>
    </Stack>
  );
}

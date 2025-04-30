import { Button, Box, Stack } from "@mui/material";
import { useUserAuth } from "/context/auth-context";

export function LoginForm() {
  const { gitHubSignIn, googleSignIn } = useUserAuth();

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

  return (
    <Stack spacing={2} width="100%" maxWidth={300}>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#24292e",
          "&:hover": { backgroundColor: "#1b1f23" },
        }}
        onClick={handleGitHubSignIn}
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
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </Button>
    </Stack>
  );
}

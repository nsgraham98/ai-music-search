import { useUserAuth } from "@/context/auth-context";
import { Typography, Button, Box, Modal } from "@mui/material";
import { useState } from "react";
import DisplayNameForm from "@/app/components/profile/display-name-form";

// TODO: clean up styling and layout

export default function SignedInAs() {
  const { user } = useUserAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Box className="flex items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
        <Typography fontSize="small">Not signed in</Typography>
      </Box>
    );
  }

  return (
    <Box className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md">
      <Typography fontSize="small">
        {user.displayName ? user.displayName : user.email}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(true)}
        sx={{ ml: 2 }}
      >
        Edit Profile
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
          }}
        >
          <DisplayNameForm onClose={() => setOpen(false)} />
        </Box>
      </Modal>
    </Box>
  );
}

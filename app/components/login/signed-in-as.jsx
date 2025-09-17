// Small component to display the signed-in user's email

import { useUserAuth } from "@/context/auth-context";
import { Typography } from "@mui/material";

export default function SignedInAs() {
  const { user } = useUserAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
        <Typography fontSize="small">Not signed in</Typography>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <Typography fontSize="small">{user.email}</Typography>
    </div>
  );
}

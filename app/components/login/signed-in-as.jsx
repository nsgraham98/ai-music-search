// Small component to display the signed-in user's display name and email

import { useUserAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SignedInAs() {
  const { user } = useUserAuth();
  const { userProfile, loadingProfile } = useUserProfile();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push(`/user/${user.uid}`);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
        <Typography fontSize="small">Not signed in</Typography>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
        <CircularProgress size={16} />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={handleClick}
      title="Click to view your profile"
    >
      <Box textAlign="center">
        {userProfile?.displayName && (
          <Typography fontSize="small" fontWeight="bold" color="black">
            {userProfile.displayName}
          </Typography>
        )}
        <Typography fontSize="small" color="gray">
          {user.email}
        </Typography>
      </Box>
    </div>
  );
}

import { useUserAuth } from "/context/auth-context";

export function LogoutButton() {
  // Use the useUserAuth hook to get the user object and the login and logout functions
  const { firebaseSignOut } = useUserAuth();
  // Sign in to Firebase with GitHub authentication
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleSignOut}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

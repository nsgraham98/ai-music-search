import { useUserAuth } from "/context/auth-context";

export function LoginForm() {
  // Use the useUserAuth hook to get the user object and the login and logout functions
  const { gitHubSignIn, googleSignIn, facebookSignIn, firebaseSignOut } =
    useUserAuth();
  // Sign in to Firebase with GitHub authentication
  const handleGitHubSignIn = async () => {
    try {
      await gitHubSignIn();
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };
  //   const handleFacebookSignIn = async () => {
  //     try {
  //       await facebookSignIn();
  //     } catch (error) {
  //       console.error("Error signing in: ", error);
  //     }
  //   };
  return (
    <div>
      <button
        onClick={handleGitHubSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

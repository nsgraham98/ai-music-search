// import { useUserAuth } from "/context/auth-context";

// export default function Login() {
//   // Use the useUserAuth hook to get the user object and the login and logout functions
//   const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
//   // Sign in to Firebase with GitHub authentication
//   const handleSignIn = async () => {
//     try {
//       await gitHubSignIn();
//     } catch (error) {
//       console.error("Error signing in: ", error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await firebaseSignOut();
//     } catch (error) {
//       console.error("Error signing out: ", error);
//     }
//   };
//   return (
//     <div>
//       {user ? (
//         <div className="flex flex-col items-start">
//           <button
//             className="bg-green-800 p-5 m-5 rounded-lg border-none hover:bg-green-900 active:bg-green-950"
//             onClick={handleSignOut}
//           >
//             Sign out
//           </button>
//           <p className="ml-5">
//             Signed in as {user.displayName} ({user.email})
//           </p>
//         </div>
//       ) : (
//         <div>
//           <button
//             className="bg-green-800 p-5 m-5 rounded-lg border-none hover:bg-green-900 active:bg-green-950"
//             onClick={handleSignIn}
//           >
//             Sign in
//           </button>
//           <p className="ml-5">Please sign in to view your profile</p>
//         </div>
//       )}
//     </div>
//   );
// }

// JAMENDO CALLBACK PAGE
// This page handles the response from Jamendo, after a user logs in with their JAMENDO account, not an OAuth provider like Google or GitHub
// The user gets redirected here after logging in with Jamendo, with a code in the URL parameters
// Logging in through a jamendo account is not in use currently, but is required for any future features that require a jamendo account
// (eg. creating playlists, favoriting tracks, etc.), using built-in jamendo features.
// Note that this is NOT the same as logging in with an OAuth provider (Google, GitHub) - that is handled in the auth-context.jsx file

import { Suspense } from "react";
import JamendoCallback from "./jamendo-callback";

export default function CallbackPage() {
  return (
    <Suspense fallback={<p>Loading callback...</p>}>
      <JamendoCallback />
    </Suspense>
  );
}

// NOT IN USE
// was intended to be a button to connect a Jamendo account
// Likely will be deleted in the future... need to confirm

export function ConnectJamendoButton() {
  const redirectToJamendo = () => {
    const state = crypto.randomUUID(); // use CSRF-safe randomness
    const clientId = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_JAMENDO_REDIRECT_URI
    );

    const authUrl = `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=music&response_type=code&state=${state}`;

    console.log("Redirecting to Jamendo:", authUrl);
    window.location.href = authUrl;
  };

  return (
    <div>
      <button
        onClick={redirectToJamendo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Connect your Jamendo account
      </button>
    </div>
  );
}

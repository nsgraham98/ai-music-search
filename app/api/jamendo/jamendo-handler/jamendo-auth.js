// NOT USED CURRENTLY - may delete later
// not called from anywhere
// Functions to handle Jamendo token management

export async function getValidJamendoToken(uid) {
  const docRef = doc(db, "sessions", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Session not found");

  const session = docSnap.data();

  if (Date.now() >= session.expires_at) {
    const refreshed = await refreshJamendoToken(session.refresh_token);

    await setDoc(docRef, {
      access_token: refreshed.access_token,
      expires_at: refreshed.expires_at,
    });

    return refreshed.access_token;
  }

  return session.access_token;
}

export async function getValidJamendoToken(uid) {
  const docRef = db.collection("sessions").doc(uid);
  const docSnap = await docRef.get();

  if (!docSnap.exists) throw new Error("Session not found");

  const session = docSnap.data();

  if (Date.now() >= session.expires_at) {
    const refreshed = await refreshJamendoToken(session.refresh_token);

    await docRef.update({
      access_token: refreshed.access_token,
      expires_at: refreshed.expires_at,
    });

    return refreshed.access_token;
  }

  return session.access_token;
}

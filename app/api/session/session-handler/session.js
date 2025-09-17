import { getIdToken } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

/**
 * Save or update the user session in Firestore.
 * @param {object} user - { uid, email, displayName, photoURL }
 * @param {string|null} providerAccessToken
 * @param {object} options - { thirdPartyTokens }
 */
export async function saveUserSession(
  user,
  providerAccessToken = null,
  { thirdPartyTokens } = {}
) {
  // If user is a Firebase Auth user, get token; otherwise skip
  let token = null;
  if (user.getIdToken) {
    token = await getIdToken(user, true);
  }

  const sessionData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerAccessToken,
    thirdPartyTokens,
    updatedAt: new Date().toISOString(),
  };

  // Save or update session data in Firestore (sessions/{uid})
  await setDoc(
    doc(db, "sessions", user.uid),
    { sessionData, token },
    { merge: true }
  );
}

/**
 * Get session data from Firestore by UID.
 * @param {string} uid
 * @returns {object|null}
 */
export async function getSessionData(uid) {
  if (!uid) return null;
  const docRef = doc(db, "sessions", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

/**
 * Delete session data from Firestore by UID.
 * @param {string} uid
 */
export async function deleteSessionData(uid) {
  if (!uid) return;
  const docRef = doc(db, "sessions", uid);
  await deleteDoc(docRef);
}

// const getSessionId = (cookieStr) => {
//   const cookies = {};
//   cookieStr?.split(";")?.forEach((cookie) => {
//     const [name, value] = cookie.trim().split("=");
//     cookies[name] = decodeURIComponent(value);
//   });
//   return cookies.session;
// };

// export const getSessionData = async (cookies) => {
//   const sessionId = getSessionId(cookies);
//   if (!sessionId) {
//     return undefined;
//   }
//   const docRef = doc(db, "sessions", sessionId);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     return { ...docSnap.data(), id: doc.id };
//   }
// };

// export const deleteSessionData = async (cookies) => {
//   const sessionId = getSessionId(cookies);
//   if (!sessionId) {
//     return undefined;
//   }
//   const docRef = doc(db, "sessions", sessionId);
//   return deleteDoc(docRef);
// };

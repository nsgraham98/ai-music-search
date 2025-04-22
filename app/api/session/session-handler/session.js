import { getIdToken } from "firebase/auth";

export async function saveUserSession(
  user,
  providerAccessToken = null,
  { thirdPartyTokens } = {}
) {
  const token = await getIdToken(user, true);

  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      ...(providerAccessToken && { providerAccessToken }),
      ...(thirdPartyTokens && { thirdPartyTokens }),
    }),
  });
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

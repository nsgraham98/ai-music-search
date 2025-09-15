import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Call this after user signs in
export async function createUserProfile(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create user profile document
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      online: true, // Set online status
      createdAt: new Date().toISOString(),
    });
  }
}

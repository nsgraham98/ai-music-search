import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Load from localStorage first
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      document.documentElement.classList.add(localTheme);
    }

    // If logged in, fetch from Firebase
    if (auth.currentUser) {
      const fetchTheme = async () => {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().theme) {
          setTheme(snap.data().theme);
          document.documentElement.classList.add(snap.data().theme);
        }
      };
      fetchTheme();
    }
  }, [auth.currentUser, db]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Remove old theme, add new one
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);

    // Update state + localStorage
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Save to Firebase if logged in
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { theme: newTheme }, { merge: true });
    }
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg shadow">
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

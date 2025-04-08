// THIS IS WHERE THE USERS API CALL GOES TO

// import { collection, getDocs, query } from "firebase/firestore";
// import { db } from "../../../utils/firebase";

export default async function handler(req, res) {
  //   const q = query(collection(db, "posts"));
  //   const querySnapshot = await getDocs(q);
  //   const items = [];
  //   querySnapshot.forEach((doc) => {
  //     items.push({ ...doc.data(), id: doc.id });
  //   });
  res.status(200).json({ message: "Hello world!" });
}

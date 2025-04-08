import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";

export default async function handler(req, res) {
  try {
    const params = req.body;
    const docRef = await addDoc(collection(db, "posts"), params);
    res.status(200).json(docRef);
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
}

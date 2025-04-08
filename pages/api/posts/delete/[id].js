 

import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../../../utils/firebase';


export default async function handler(
  req,
  res
) {
  try {
    const docRef = doc(db, "posts", req.query.id);
      res.status(200).json(await deleteDoc(docRef, req.body))
    res.status(200).json(docRef)
  } catch (e) {
    res.status(422).json({ error: e.message });
  }
}

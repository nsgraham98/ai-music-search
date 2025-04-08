import { doc, getDoc } from "firebase/firestore";
import { db } from '../../../../utils/firebase';


export default async function GET(
  req,
  res
) {
  const docRef = doc(db, "posts", req.query.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.status(200).json({...docSnap.data(), id: doc.id});
    } else {
      res.status(404).json({ error: "No such post!" });
    }
}

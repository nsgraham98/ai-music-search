// THIS IS WHERE THE USERS API CALL TO OUR APP GOES TO

// import { collection, getDocs, query } from "firebase/firestore";
// import { db } from "../../../utils/firebase";

export default async function handler(req, res) {
  //   const q = query(collection(db, "posts"));
  //   const querySnapshot = await getDocs(q);
  //   const items = [];
  //   querySnapshot.forEach((doc) => {
  //     items.push({ ...doc.data(), id: doc.id });
  //   });

  // example of how to get the data from the database
  //   res.status(200).json( {myData: "example"} );
  res.status(200).json({ message: dataReturned });
}

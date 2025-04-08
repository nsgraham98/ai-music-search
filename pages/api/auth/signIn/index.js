 

// import { collection, getDocs, query } from "firebase/firestore";
// import { db } from '../../../utils/firebase';
// import { encrypt } from '@/app/lib/session'
import { db } from '@/utils/firebase';
import { serialize } from 'cookie'
import { addDoc, collection } from 'firebase/firestore';


export default async function handler(
  req,
  res
) {
  const sessionData = req.body
  // save session data to the database and return the id
  const docRef = await addDoc(collection(db, "sessions"), sessionData);
  const cookie = serialize('session', docRef.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'Successfully set cookie!' })
}

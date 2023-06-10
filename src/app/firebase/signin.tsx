import { initFirebase, initDB } from '../firebase/config';
import { collection, addDoc } from "firebase/firestore"
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

initFirebase();
const db = initDB();
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signIn = async() => {
    const result = await signInWithPopup(auth, provider);
    console.log(result)
    try {
    const docRef = await addDoc(collection(db, "users"), {
      user_id: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      verified: result.user.emailVerified,
      photo_link: result.user.photoURL
    });
    console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
import { initFirebase, initDB } from './config';
import { doc, setDoc } from "firebase/firestore"
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

initFirebase();
const db = initDB();
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
      var data = {
        user_id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        verified: result.user.emailVerified,
        photo_link: result.user.photoURL,
        steam_info: 
        {
          id: null,
          url: null,
          name: null
        }
      }
      try {
        setDoc(doc(db, "users", result.user.uid), data);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode + "\n" + errorMessage);
    });
  }
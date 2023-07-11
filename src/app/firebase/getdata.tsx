import { initFirebase, initDB } from './config';
import { } from "firebase/firestore"
import { getAuth, onAuthStateChanged  } from "firebase/auth";

initFirebase();
const db = initDB();
const auth = getAuth();

export const getUser = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            return user;
        } else {
            return null;
        }
        });
}

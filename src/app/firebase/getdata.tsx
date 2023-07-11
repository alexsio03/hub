import { initFirebase, initDB } from './config';
import { } from "firebase/firestore"
import { getAuth} from "firebase/auth";

initFirebase();
const db = initDB();
const auth = getAuth();

export function getCurrUser() {
    
}

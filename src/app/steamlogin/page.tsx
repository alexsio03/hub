"use client"
import axios from "axios";
import {useRouter} from 'next/navigation'
import {initFirebase,initDB} from '../fb/config';
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import {doc,updateDoc} from "firebase/firestore";

initFirebase();
const db = initDB();
export default function Home() {
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const router = useRouter()

    const fetchData = async () => {
        if (user) {
            var uid = user.uid
        }
        try {
            const response = await axios.get("//localhost:3000/api/steam", {
                withCredentials: true
            });
            if (response.status === 200) {
                const data = response.data;
                if(data) {
                    var steamName = data.passport.user._json.personaname;
                    var steamUrl = data.passport.user._json.profileurl;
                    var steamID = data.passport.user._json.steamid;
                }
                try {
                updateDoc(doc(db, "users", uid), {
                    steam_info: {
                        id: steamID,
                        url: steamUrl,
                        name: steamName
                    }
                });
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
                router.push("/")
            } else {
                console.error("Error getting data:", response.status);
            }
        } catch (error) {
            console.error("Error getting data:", error);
        }
    };

    fetchData();
    return ( <></>)
}
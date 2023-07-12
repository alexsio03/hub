"use client"
import axios from "axios";
import {useRouter} from 'next/navigation'
import {initFirebase,initDB} from '../fb/config';
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import {doc,updateDoc} from "firebase/firestore";
import LoadInventory from "../helpers/loadinventory";
import { getStorage, ref, uploadString } from "firebase/storage";

initFirebase();
const db = initDB();
const storage = getStorage();
export default function Home() {
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const router = useRouter()

    const fetchData = async () => {
        if (user) {
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
                        updateDoc(doc(db, "users", user.uid), {
                            steam_info: {
                                id: steamID,
                                url: steamUrl,
                                name: steamName
                            }
                        });
                        const inventoryData = await LoadInventory(steamID);
                        if(inventoryData) {
                            const jsonData = JSON.stringify(inventoryData);
                            const storageRef = ref(storage, `user_inventories/${user.uid}.json`);

                            uploadString(storageRef, jsonData, 'raw', { contentType: 'application/json' })
                            .then(() => {
                                console.log('JSON uploaded successfully!');
                            })
                            .catch(error => {
                                console.error('Error uploading JSON:', error);
                            });
                        }
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
        }
        
    };

    fetchData();
    return ( <></>)
}
// Import necessary dependencies
"use client"
import axios from "axios";
import { useRouter } from 'next/navigation'
import { initFirebase, initDB } from '../fb/config';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import LoadInventory from "../helpers/loadinventory";
import { getStorage, ref, uploadString } from "firebase/storage";

// Initialize Firebase
initFirebase();
const db = initDB();
const storage = getStorage();

// Define the Home component
export default function Home() {
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const router = useRouter()

    // Fetch data from the API endpoint
    const fetchData = async () => {
        let URLParams;
        let steamName;
        let steamUrl;
        let steamID;
        if (user) {
            try {   
                    if (typeof window !== "undefined") {
                        URLParams = new URLSearchParams(window.location.search);
                        steamName = URLParams.get('name');
                        steamUrl = URLParams.get('url');
                        steamID = URLParams.get('id');
                    }
                        // Load inventory data using the LoadInventory helper function
                        const inventoryData = await LoadInventory(steamID);
                        if (inventoryData) {
                            // Convert the inventory data to JSON string
                            const jsonData = JSON.stringify(inventoryData);

                            // Get a reference to the storage location
                            const storageRef = ref(storage, `user_inventories/${user.uid}.json`);

                            // Upload the JSON data to Firebase Storage
                            uploadString(storageRef, jsonData, 'raw', { contentType: 'application/json' })
                                .then(() => {
                                    console.log('Inventory uploaded successfully!');
                                })
                                .catch(error => {
                                    console.error('Error uploading JSON:', error);
                                });
                        }
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                    // Redirect the user to the home page
                    router.push("/inventory");
            }
    };

    // Call the fetchData function
    fetchData();

    // Return an empty fragment
    return (<></>);
}

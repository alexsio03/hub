// Import necessary dependencies and components
"use client"
import Nav from '../components/nav';
import Inventorycard from '../components/inventorycard';
import IconRequest from '../helpers/icons/iconrequest.js';
import axios from 'axios';
import GenerateInspectLink from '../helpers/getinspectlink';

import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { initDB, initFirebase } from '../fb/config';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';

// Initialize Firebase + db and storage
initFirebase();
const db = initDB();
const storage = getStorage();

export default function Inventory() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState<{ [key: string]: any }[]>([]);

  // Run this effect whenever the "user" state changes
  useEffect(() => {
    // Define an async function to fetch user data
    const getUser = async () => {
      if (user) {
        const dbUser = await doc(db, "users", user.uid);
        const userSnap = await getDoc(dbUser);
        return userSnap.data();
      } else {
        return null;
      }
    };

    // Fetch inventory data and process inventory
    getUser().then(async (user) => {
      var json;
      if (user) {
        // Get the download URL for the user's inventory JSON file
        const downloadURL = await getDownloadURL(ref(storage, `user_inventories/${user.user_id}.json`));
        try {
          // Make an HTTP request to our backend to fetch the JSON data from our storage
          const response = await axios.get('/fb-proxy', {
            params: {
              downloadURL: downloadURL,
            },
          });
          json = response.data;
        } catch (error) {
          console.error('Error occurred:', error);
        }
        var newItems = [];
        var length = Object.keys(json.descriptions).length;
        for (var i = 0; i < length; i++) {
          var invItem = json.descriptions[i];
          let marketable = invItem.marketable;
          let currentItem = {
            itemIcon: await IconRequest(invItem.market_name),
            itemName: invItem.market_name,
            itemIsMarketable: marketable, // 0 or 1 (1 can be marketed)
            itemTradeStatus: invItem.tradable, // 0 or 1 (1 can be traded)
            itemDateTradable: marketable ? invItem.cache_expiration : 'notmarketable',
            itemInspectLink: GenerateInspectLink(json, invItem.market_name, user.steam_info.id)
          };
          newItems[i] = currentItem;
        }
        setInventory(newItems);
      } else {
        console.log("User not found.");
      }
    }).catch((error) => {
      console.error("Error occurred:", error);
    });
  }, [user]);

  return (
    <>
      <Nav></Nav>
      <div className='m-6'>
        <div className='flex flex-row flex-wrap'>
          {/* Render Inventorycard component for each item in the inventory */}
          {inventory.map((itemInformation, index) => (
            <Inventorycard key={index} itemInfo={itemInformation} />
          ))}
        </div>
      </div>
    </>
  )
}

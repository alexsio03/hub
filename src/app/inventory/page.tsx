// Import necessary dependencies and components
"use client"
import Nav from '../components/nav';
import Inventorycard from '../components/inventorycard';
import axios from 'axios';
import GenerateInspectLink from '../helpers/getinspectlink';
import skindata from "../helpers/skindata.json"

import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { initDB, initFirebase } from '../fb/config';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';
import SizeIcon from '../helpers/icons/sizeicon';
import ParseTags from '../helpers/parsetags.js';

// Initialize Firebase + db and storage
initFirebase();
const db = initDB();
const storage = getStorage();

export default function Inventory() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState<{ [key: string]: any }[]>([]);
  const skinArr = Object.entries(skindata.items_list);

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
            itemIcon: SizeIcon(invItem),
            itemName: invItem.market_hash_name,
            itemIsMarketable: marketable, // 0 or 1 (1 can be marketed)
            itemTradeStatus: invItem.tradable, // 0 or 1 (1 can be traded)
            itemInspectLink: GenerateInspectLink(json, invItem.market_hash_name, user.steam_info.id),
            itemWear: ParseTags(json, invItem.market_name, "Exterior"), // Factory New, Minimal Wear, etc.
            itemType: ParseTags(json, invItem.market_name, "Type"), // Pistol, Container, Graffiti, Rifle, etc.
            itemWeaponType: ParseTags(json, invItem.market_name, "Weapon"), // Five-Seven, AK-47, M4A4, etc.
            itemRarity: ParseTags(json, invItem.market_name, "Rarity"), // Mil-Spec, Contraband, Restricted, Covert, etc.
            itemRarityColor: ParseTags(json, invItem.market_name, "Color"),
            itemIsSouvenir: ParseTags(json, invItem.market_name, "Souvenir"), // 1 is souvenir, 0 is normal
            itemIsStatTrak: ParseTags(json, invItem.market_name, "StatTrak") // 1 is stattrak, 0 is normal
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
      <div className='my-6 ml-20'>
        <div className='flex flex-row flex-wrap'>
          {inventory.map((item, index) => (
            <Inventorycard key={index} itemInfo={item} />
          ))}
        </div>
      </div>
    </>
  )
}

"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import Inventorycard from "../components/inventorycard";
import SetIcon from "../helpers/icons/seticon";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import axios from "axios";
import Tradecard from "../components/tradecard";

initFirebase();
const db = initDB();
const storage = getStorage();

export default function CreateTradePage() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [requestedItem, setRequestedItem] = useState("");
  const router = useRouter();

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
          if(invItem.actions) {
            var link = JSON.stringify(invItem.actions[0].link);
            var assetid = json.assets.find((asset) => asset.classid == invItem.classid).assetid;
            link = link.replace("%owner_steamid%", user.steam_info.id).replace("%assetid%", assetid)
          }

          let currentItem = {
            itemIcon: SetIcon(invItem),
            itemName: invItem.market_name,
            itemIsMarketable: marketable, // 0 or 1 (1 can be marketed)
            itemTradeStatus: invItem.tradable, // 0 or 1 (1 can be traded)
            itemDateTradable: marketable ? invItem.cache_expiration : 'notmarketable',
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
  const handleItemSelected = (item) => {
    const updatedSelectedItems = [...selectedItems];
    const index = updatedSelectedItems.findIndex((selectedItem) => selectedItem.id === item.id);
    if (index !== -1) {
      updatedSelectedItems.splice(index, 1);
    } else {
      updatedSelectedItems.push(item);
    }
    setSelectedItems(updatedSelectedItems);
  };

  const handleRequestedItemChange = (event) => {
    setRequestedItem(event.target.value);
  };

  const handleSubmitTrade = async () => {
    // Validate selected items and requested item

    // Create trade object
    const trade = {
      user: user.uid,
      userItems: selectedItems,
      requestedItem: requestedItem,
    };

    // Save trade to the database

    // Redirect to the TradesPage
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div>
          <h2>User Inventory:</h2>
          <div className='flex flex-row flex-wrap'>
            {inventory.map((itemInformation, index) => (
                <Inventorycard key={index} itemInfo={itemInformation} />
              ))}
          </div>
        </div>
        <div>
          <Tradecard></Tradecard>
        </div>
        <div>
          <h2>Requested Item</h2>
          <input className="text-black" type="text" value={requestedItem} onChange={handleRequestedItemChange} />
        </div>
      </div>
      {/* Additional trade setup */}
      <button onClick={handleSubmitTrade}>Submit Trade</button>
    </>
  );
}

"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import Inventorycard from "../components/inventorycard";
import IconRequest from "../helpers/icons/iconrequest.js";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import axios from "axios";
import Tradecard from "../components/tradecard";
import skindata from "../helpers/skindata.json"
import Itemcard from "../components/itemcard";

initFirebase();
const db = initDB();
const storage = getStorage();

export default function CreateTradePage() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [requestedItems, setRequestedItems] = useState([]);
  const router = useRouter();
  const skinArr = Object.entries(skindata.items_list);
  const skin25 = skinArr.slice(0, 25).map(([itemName, itemInfo]) => ({
    itemInfo: {
        itemName: itemName.replaceAll('&#39', '\''),
        itemIsMarketable: 1,
        id: hash(itemName),
        itemData: skinArr.find((item) => item[0] == itemName)
      }
  }));

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
            itemIcon: IconRequest(invItem),
            itemName: invItem.market_name,
            itemIsMarketable: marketable, // 0 or 1 (1 can be marketed)
            itemTradeStatus: invItem.tradable, // 0 or 1 (1 can be traded)
            itemDateTradable: marketable ? 'no hold' : invItem.cache_expiration,
            id: hash(invItem.market_name + user.user_id + invItem.classid)
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

  function handleItemSelected(clickedItem) {
    // Perform actions using itemInformation
    var updatedSelectedItems = [...selectedItems];
    const index = updatedSelectedItems.findIndex((selectedItem) => selectedItem.id === clickedItem.id);
    if (index !== -1) {
      updatedSelectedItems.splice(index, 1);
    } else {
      updatedSelectedItems.push(clickedItem);
    }
    setSelectedItems(updatedSelectedItems);
  }

  const handleItemRequested = (requested) => {
    var updatedRequestedItems = [...requestedItems];
    const index = updatedRequestedItems.findIndex((requestedItem) => requestedItem.id === requested.id);
    if (index !== -1) {
      updatedRequestedItems.splice(index, 1);
    } else {
      updatedRequestedItems.push(requested);
    }
    setRequestedItems(updatedRequestedItems);
  };

  const handleSubmitTrade = async () => {
    // Validate selected items and requested item
    if (!user || !selectedItems || !requestedItems) {
      console.error("Invalid trade data. Some required fields are missing.");
      return;
    }

    // Create trade object
    const trade = {
      owner: user.uid,
      offered_items: selectedItems,
      requested_items: requestedItems,
    };

    // Save trade to the database
    try {
      const tradesRef = collection(db, "trades");
      await addDoc(tradesRef, trade);

      // Redirect to the TradesPage
      router.push("/trades");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-around">
        <div className="max-w-2xl min-w-2xl">
          <h2 className="text-center">User Inventory:</h2>
          <div className='flex flex-row flex-wrap justify-center'>
            {inventory.map((itemInformation, index) => (
              <button key={index} onClick={() => handleItemSelected(itemInformation)} className="item-button">
                <Inventorycard itemInfo={itemInformation} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col max-w-3xl min-w-3xl">
          <div className='flex flex-row flex-wrap justify-center'>
            <Tradecard offers={selectedItems} requests={requestedItems}/>
          </div>
          {/* Additional trade setup */}
          <button onClick={handleSubmitTrade}>Submit Trade</button>
        </div>
        <div className="max-w-2xl min-w-2xl">
          <h2 className="text-center">Requested Items</h2>
          {/* <input className="text-black" type="text" value={requestedItem} onChange={handleRequestedItemChange} /> */}
          <div className='flex flex-row flex-wrap justify-center'>
            {skin25.map((skin, index) => (
              <button key={index} onClick={() => {}} className="item-button">
                {<Itemcard item={skin} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function hash(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

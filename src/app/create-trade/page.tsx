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
import Nav from "../components/nav";
import SizeIcon from "../helpers/icons/sizeicon";

initFirebase();
const db = initDB();
const storage = getStorage();

export default function CreateTradePage() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState([]);
  const [offeredItems, setOfferedItems] = useState([]);
  const [requestedItems, setRequestedItems] = useState([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const skinArr = Object.entries(skindata.items_list);
  const filteredItems = skinArr.filter(([itemName]) => {
    const keywords = searchQuery.toLowerCase().split(" ");
    return keywords.every((keyword) => itemName.toLowerCase().includes(keyword));
  }).slice(0, 25).map(([itemName, itemInfo]) => ({
      itemName: itemName.replaceAll('&#39', '\''),
      itemIsMarketable: 1,
      id: hash(itemName),
      itemIcon: SizeIcon(skinArr.find((item) => item[0] == itemName)[1])
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
            itemIcon: SizeIcon(invItem),
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

  const handleSubmitTrade = async () => {
    // Validate selected items and requested item
    if (!user || !offeredItems || !requestedItems) {
      console.error("Invalid trade data. Some required fields are missing.");
      return;
    }
    console.log(user)

    // Create trade object
    const trade = {
      owner: user.uid,
      owner_name: user.displayName,
      offered_items: offeredItems,
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

  function handleItemOffered(clickedItem) {
    // Perform actions using itemInformation
    var updatedOfferedItems = [...offeredItems];
    var updateInv = [...inventory];
    const index = updatedOfferedItems.findIndex((offeredItem) => offeredItem.id === clickedItem.id);
    if (index !== -1) {
      updatedOfferedItems.splice(index, 1);
    } else {
      updatedOfferedItems.push(clickedItem);
      setOfferedItems(updatedOfferedItems);
      updateInv.splice(inventory.findIndex((offeredItem) => offeredItem.id === clickedItem.id), 1)
      setInventory(updateInv)
    }
  }

  function handleItemRequested(clickedItem) {
    // Perform actions using itemInformation
    var updatedRequestedItems = [...requestedItems];
    const index = updatedRequestedItems.findIndex((requestedItem) => requestedItem.id === clickedItem.id);
    if (index !== -1) {
      updatedRequestedItems.splice(index, 1);
    } else {
      updatedRequestedItems.push(clickedItem);
      setRequestedItems(updatedRequestedItems);
    }
  }

  const removeItem = (item) => {
    var updatedOfferedItems = [...offeredItems];
    var updatedRequestedItems = [...requestedItems];
    var updateInv = [...inventory];
    const itemID = item.target.alt;
    const isOffered = offeredItems.find((offeredItem) => offeredItem.id == itemID);
    var index;
    if(isOffered) {
      index = updatedOfferedItems.findIndex((offeredItem) => offeredItem.id == itemID);
      if (index !== -1) {
        var removingItem = updatedOfferedItems.at(index)
        updatedOfferedItems.splice(index, 1);
        updateInv.push(removingItem)
        setInventory(updateInv)
      }
      setOfferedItems(updatedOfferedItems);
    } else {
      index = updatedRequestedItems.findIndex((requestedItem) => requestedItem.id == itemID);
      if (index !== -1) {
        var removingItem = updatedRequestedItems.at(index)
        updatedRequestedItems.splice(index, 1);
      }
      setRequestedItems(updatedRequestedItems);
    }
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Nav></Nav>
      <div className="flex flex-col">
        <div className="flex flex-col min-w-3xl items-center justify-center">
            <div className='flex flex-col flex-wrap items-start mx-6'>
              <button onClick={(item) => removeItem(item)}>
                <Tradecard offers={offeredItems} requests={requestedItems}/>
              </button>
            </div>
            {/* Additional trade setup */}
            <button onClick={handleSubmitTrade}>Submit Trade</button>
        </div>
        <div className="flex flex-row justify-around">
          <div className="max-w-5xl">
            <h2 className="text-center">User Inventory:</h2>
            <div className='flex flex-row flex-wrap justify-center'>
              {inventory.map((itemInformation, index) => (
                <button key={index} onClick={() => handleItemOffered(itemInformation)} className="item-button m-1">
                  <Inventorycard itemInfo={itemInformation} />
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-4xl">
            <h2 className="text-center">Requested Items</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search items..."
                className="text-black ml-14"
              />
            <div className='flex flex-row flex-wrap justify-center'>
              {filteredItems.map((skin, index) => (
                <button key={index} onClick={() => handleItemRequested(skin)} className="item-button">
                  {<Itemcard itemData={skin} />}
                </button>
              ))}
            </div>
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

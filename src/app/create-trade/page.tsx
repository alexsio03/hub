"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { initDB, initFirebase } from "../fb/config";
import Inventorycard from "../components/inventorycard";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import axios from "axios";
import skindata from "../helpers/skindata.json"
import skinprices from '../helpers/prices/skinPrices.json'
import Itemcard from "../components/itemcard";
import Nav from "../components/nav";
import SizeIcon from "../helpers/icons/sizeicon";
import SetPrice from "../helpers/prices/setprice";
import findItem from "../helpers/findItem";
import Tradecard from "../components/tradecard";

// Initialize Firebase
initFirebase();
const db = initDB();
const storage = getStorage();

export default function CreateTradePage() {
  // Authentication
  const auth = getAuth();
  const [user] = useAuthState(auth);

  // State variables
  const [inventory, setInventory] = useState<any[]>([]);
  const [offeredItems, setOfferedItems] = useState<any[]>([]);
  const [requestedItems, setRequestedItems] = useState<any[]>([]);
  const [steamInfo, setSteamInfo] = useState({
    steam_name: "",
    steam_url: ""
  });

  const router = useRouter();

  // State variables for filtering items in the inventory and requested items
  const [searchQuery, setSearchQuery] = useState("");
  const [invSearchQuery, setInvSearchQuery] = useState("");
  const [minReqPrice, setMinReqPrice] = useState("");
  const [maxReqPrice, setMaxReqPrice] = useState("");
  const [minInvPrice, setMinInvPrice] = useState("");
  const [maxInvPrice, setMaxInvPrice] = useState("");
  // State variable to track the loading state for the "Submit Trade" button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert skindata and skinprices to arrays
  const skinData = Object.entries(skindata);
  const skinArr = Object.entries(skinData[3][1]);
  const skinPrices = Object.entries(skinprices);

  // Filter and map the items based on search query and price range for requested items
  const filteredItems = skinPrices
  .filter(([itemName]) => {
    const keywords = searchQuery.toLowerCase().split(" ");
    return keywords.every((keyword) =>
      itemName.toLowerCase().includes(keyword)
    );
  })
  .filter(([itemName, itemInfo]) => {
    const price = SetPrice(itemName).buff; // Replace 'buff' with 'steam' if needed
    const minPriceValue = convertPriceToDecimal(minReqPrice);
    const maxPriceValue = convertPriceToDecimal(maxReqPrice);

    if (price === null || price === '$null' || price === 'No Data') {
      return false; // Exclude items with null price
    }

    const itemPriceValue = convertPriceToDecimal(price);

    if (!isNaN(minPriceValue) && itemPriceValue < minPriceValue) {
      return false; // Exclude items with a price lower than the minimum price
    }

    if (!isNaN(maxPriceValue) && itemPriceValue > maxPriceValue) {
      return false; // Exclude items with a price higher than the maximum price
    }

    return true;
  })
  .slice(0, 39)
  .map(([itemName, itemInfo]) => {
    itemName = itemName.replaceAll("&#39", "'"); // Replace HTML entity for '
    const foundItem = skinArr.find((item) => item[0] === itemName);

    return {
      itemName,
      itemIsMarketable: 1,
      id: hash(itemName),
      itemIcon: foundItem ? SizeIcon(foundItem[1]) : null, // Perform a null check
    };
  });


  // Filter and map the items in the user's inventory based on search query and price range
  const filteredInventory = inventory.filter((item: any) =>
    item.itemName.toLowerCase().includes(invSearchQuery)).filter((item) => {
    const price = item.itemIsMarketable ? SetPrice(item.itemName).buff : null; // Replace 'buff' with 'steam' if needed
    const minPriceValue = parseFloat(minInvPrice);
    const maxPriceValue = parseFloat(maxInvPrice);

    if (price === null || price == '$null') {
      return false; // Exclude items with null price
    }

    if (!isNaN(minPriceValue) && convertPriceToDecimal(price) < minPriceValue) {
      return false; // Exclude items with price lower than the minimum price
    }

    if (!isNaN(maxPriceValue) && convertPriceToDecimal(price) > maxPriceValue) {
      return false; // Exclude items with price higher than the maximum price
    }

    return true;
  });

  // Fetch user data and inventory data from Firebase
  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const dbUser = await doc(db, "users", user.uid);
        const userSnap = await getDoc(dbUser);
        return userSnap.data();
      } else {
        return null;
      }
    };

    getUser().then(async (user) => {
      var json;
      if (user) {
        setSteamInfo({
          steam_name: user.steam_info.name,
          steam_url: user.steam_info.url
        })

        // Get the download URL for the user's inventory JSON file
        const downloadURL = await getDownloadURL(ref(storage, `user_inventories/${user.user_id}.json`));
        try {
          // Make an HTTP request to fetch the JSON data from the storage
          const response = await axios.get('/api/fb-proxy', {
            params: {
              downloadURL: downloadURL,
            },
          });
          json = response.data;
        } catch (error) {
          console.error('Error occurred:', error);
        }

        // Process inventory data and update state
        var newItems = [];
        var length = Object.keys(json.descriptions).length;
        for (var i = 0; i < length; i++) {
          var invItem = json.descriptions[i];
          let marketable = invItem.marketable;
          if (invItem.actions) {
            var link = JSON.stringify(invItem.actions[0].link);
            var assetid = json.assets.find((asset: any) => asset.classid == invItem.classid).assetid;
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
        setInventory(newItems)
      } else {
        console.log("User not found.");
      }
    }).catch((error) => {
      console.error("Error occurred:", error);
    });
  }, [user]);

  // Handle the trade submission
  const handleSubmitTrade = async () => {
    
    // Validate selected items and requested items
    if (!user || offeredItems.length == 0 || requestedItems.length == 0) {
      console.error("Invalid trade data. Some required fields are missing.");
      return;
    }

    setIsSubmitting(true); // Set loading state to true when submitting the trade.
    // Create trade object
    for (let i = 0; i < requestedItems.length; i++) {
      requestedItems[i].category = findItem(requestedItems[i].itemName).category || findItem(requestedItems[i].itemName).id;
    }
    for (let i = 0; i < offeredItems.length; i++) {
      offeredItems[i].category = findItem(offeredItems[i].itemName).category || findItem(offeredItems[i].itemName).id; 
    }

    const trade = {
      owner: user.uid,
      owner_steam: steamInfo,
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

  // Handle item offered by the user
  function handleItemOffered(clickedItem: any) {
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

  // Handle item requested by the user
  function handleItemRequested(clickedItem: any) {
    var updatedRequestedItems = [...requestedItems];
    const index = updatedRequestedItems.findIndex((requestedItem) => requestedItem.id === clickedItem.id);
    if (index !== -1) {
      updatedRequestedItems.splice(index, 1);
    } else {
      updatedRequestedItems.push(clickedItem);
      setRequestedItems(updatedRequestedItems);
    }
  }

  // Remove an item from the offered or requested items list
  const removeItem = (item: any) => {
    var updatedOfferedItems = [...offeredItems];
    var updatedRequestedItems = [...requestedItems];
    var updateInv = [...inventory];
    const itemID = item.target.alt;
    const isOffered = offeredItems.find((offeredItem) => offeredItem.id == itemID);
    var index;
    if (isOffered) {
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

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleInvSearch = (event: any) => {
    setInvSearchQuery(event.target.value);
  };

  return (
    <>
      <Nav></Nav>
      <div className="flex flex-col mb-8">
        <div className="flex flex-col items-center justify-center">
            <div className='flex flex-col items-center justify-center flex-wrap w-full'>
              {/* Display the trade card with selected items */}
              <button className="w-5/6" onClick={(item) => removeItem(item)}>
                <Tradecard offers={offeredItems} requests={requestedItems} is_owner={false} onDeleteTrade={() => {return null}} owner={"You"} owner_url="" id={"0"}/>
              </button>
            </div>
            {/* Button to submit the trade */}
            <button
              onClick={handleSubmitTrade}
              className={`bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white font-bold text-lg py-2 px-4 rounded-md shadow-lg ${
                isSubmitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Trade'
              )}
            </button>
        </div>
        <div className="flex flex-row justify-around m-4">
          {/* User Inventory */}
          <div className="w-1/2 mr-10 p-2 rounded-md bg-sky-800 bg-opacity-30">
            <h2 className="text-center">User Inventory:</h2>
            <div className="flex justify-between mx-2 my-6">
              <div className="flex flex-row">
                <p className="mt-1">Search: </p>
                <input
                  type="text"
                  value={invSearchQuery}
                  onChange={handleInvSearch}
                  placeholder="Karambit Doppler"
                  className="text-black p-1 rounded-sm ml-2"
                />
              </div>
              <div className="flex flex-row">
                <p className="mt-1">Minimum: </p>
                <input
                  type="number"
                  value={minInvPrice}
                  onChange={(e) => setMinInvPrice(e.target.value)}
                  placeholder="$25"
                  className="text-black p-1 rounded-sm w-28 ml-2"
                />
              </div>
              <div className="flex flex-row">
                <p className="mt-1">Maximum: </p>
                <input
                  type="number"
                  value={maxInvPrice}
                  onChange={(e) => setMaxInvPrice(e.target.value)}
                  placeholder="$100"
                  className="text-black p-1 rounded-sm w-28 ml-2"
                />
              </div>
            </div>
            <div className='flex flex-row flex-wrap justify-center h-[700px] overflow-y-auto snap-y'>
              {filteredInventory.map((itemInformation, index) => (
                <button key={index} onClick={() => handleItemOffered(itemInformation)} className="item-button m-1 snap-start">
                  <Inventorycard item={itemInformation} />
                </button>
              ))}
            </div>
          </div>
          {/* Requested Items */}
          <div className="w-1/2 p-2 rounded-md bg-sky-800 bg-opacity-30">
            <h2 className="text-center">Requested Items</h2>
            <div className="flex justify-between mx-2 my-6">
              <div className="flex flex-row">
                <p className="mt-1">Search: </p>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="M9 Bayo"
                  className="text-black p-1 rounded-sm ml-2"
                />
              </div>
              <div className="flex flex-row">
                <p className="mt-1">Minimum: </p>
                <input
                  type="number"
                  value={minReqPrice}
                  onChange={(e) => setMinReqPrice(e.target.value)}
                  placeholder="$25"
                  className="text-black p-1 rounded-sm w-28 ml-2"
                />
              </div>
              <div className="flex flex-row">
                <p className="mt-1">Maximum: </p>
                <input
                  type="number"
                  value={maxReqPrice}
                  onChange={(e) => setMaxReqPrice(e.target.value)}
                  placeholder="$100"
                  className="text-black p-1 rounded-sm w-28 ml-2"
                />
              </div>
            </div>
            <div className='flex flex-row flex-wrap justify-center h-[700px] overflow-y-auto snap-y'>
              {filteredItems.map((skin, index) => (
                <button key={index} onClick={() => handleItemRequested(skin)} className="item-button snap-start">
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

// Helper function to calculate hash
function hash(str: any) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// Helper function to convert price to decimal
function convertPriceToDecimal(price: any) {
  // Remove any non-numeric characters from the string (e.g., "$" or commas)
  const numericString = price.replace(/[^\d.-]/g, "");

  // Parse the string to a float
  const decimalPrice = parseFloat(numericString);

  return decimalPrice;
}

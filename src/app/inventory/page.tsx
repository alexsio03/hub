// Import necessary dependencies and components
"use client"
import Nav from '../components/nav';
import Inventorycard from '../components/inventorycard';
import axios from 'axios';
import GenerateInspectLink from '../helpers/getinspectlink';

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { initDB, initFirebase } from '../fb/config';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';
import SizeIcon from '../helpers/icons/sizeicon';
import ParseTags from '../helpers/parsetags.js';
import React from 'react';
import { InformationCircleIcon } from "@heroicons/react/24/outline"; // Import the InfoIcon from Hero Icons
import SetPrice from '../helpers/prices/setprice';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Initialize Firebase + db and storage
initFirebase();
const db = initDB();
const storage = getStorage();

export default function Inventory() {
  const auth = getAuth();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState<{ [key: string]: any }[]>([]);
  const [selling, setSelling] = useState(false)
  const [sellingItems, setSellingItems] = useState([] as { [key: string]: any }[]);
  const [showModal, setShowModal] = useState(false);
  const [invSearchQuery, setInvSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });
  const [showInfoIndex, setShowInfoIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInfoWindow = (event: any, index: any) => {
    setShowInfo(!showInfo);
    setShowInfoIndex(index);
    setInfoPosition({ x: event.clientX, y: event.clientY });
  };

  // Filter and map the items in the user's inventory based on search query and price range
  const filteredInventory = inventory.filter((item) => item.itemName.toLowerCase().includes(invSearchQuery));

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
          const response = await axios.get('/api/test', {
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
            id: hash(invItem.market_name + user.user_id + invItem.classid),
            itemIcon: SizeIcon(invItem),
            itemName: invItem.market_hash_name,
            itemIsMarketable: marketable, // 0 or 1 (1 can be marketed)
            itemTradeStatus: invItem.tradable, // 0 or 1 (1 can be traded)
            itemInspectLink: GenerateInspectLink(json, invItem.market_hash_name, user.steam_info.id),
            itemWear: ParseTags(json, invItem.market_name, "Exterior"), // Factory New, Minimal Wear, etc.
            itemType: ParseTags(json, invItem.market_name, "Type"), // Pistol, Container, Graffiti, Rifle, etc.
            itemWeaponType: ParseTags(json, invItem.market_name, "Weapon") || null, // Five-Seven, AK-47, M4A4, etc.
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

  const updateSelling = () => {
    setSelling(!selling)
  }

  const addSale = (item: any) => {
    var oldInv = [...inventory]
    var ind = oldInv.findIndex((inv_item) => inv_item.id === item.id)
    oldInv.splice(ind, 1)
    setInventory(oldInv);
    setSellingItems([...sellingItems, item]);
  };

  const removeSale = (item: any) => {
    var oldSales = [...sellingItems]
    var ind = oldSales.findIndex((sale) => sale.id === item.id)
    oldSales.splice(ind, 1)
    setSellingItems(oldSales);
    setInventory([...inventory, item]);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDupe = async (sale: any, document: any, index: any) => {
      const confirmation = window.confirm(
        `You already have a listing for ${sale.itemName} at $${document.data().itemInfo.sellPrice}. Do you want to replace it with the new sale at $${sale.sellPrice}?`
      );

    if (confirmation) {
      // Remove the existing sale and add the new sale in its place
      const itemRef = doc(db, "market", document.id);
      // Delete the trade document from Firestore.
      await deleteDoc(itemRef);
    } else {
      // No existing sale, just add the new sale to the sellingItems array
      sellingItems.splice(index, 1);
    }
  };


  const handleItemPriceSubmit = async () => {
    // Check if any input field is empty
    const isEmptyField = sellingItems.some((item) => !item.sellPrice);
    if (isEmptyField) {
      alert('Please fill in all price fields before submitting.');
      return;
    }



    // Save trade to the database
    try {
      setIsLoading(true);
      const marketRef = collection(db, "market");

      const q = query(marketRef, where("owner", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        sellingItems.forEach((sale, index) => {
          if (doc.data().itemInfo.id == sale.id) {
            handleDupe(sale, doc, index);
          }
        });
      });

      for(var i = 0; i < sellingItems.length; i++) {
      const sale = {
        owner: user?.uid,
        owner_name: user?.displayName,
        itemInfo: sellingItems[i],
        listDate: new Date().toISOString()
      };
      await addDoc(marketRef, sale);
    }
      // Redirect
      router.push("/market");
    } catch (error) {
      console.error("Error adding document: ", error);
    } 
  };

  const handleInvSearch = (event: any) => {
    setInvSearchQuery(event.target.value);
  };

  const autoFillSuggestedPrices = () => {
    // Create a copy of the sellingItems array with updated sell prices
    const updatedSellingItems = sellingItems.map((item) => ({
      ...item,
      sellPrice: getLowest(item.itemName),
    }));

    // Update the state with the updated sellingItems array
    setSellingItems(updatedSellingItems);
  };

  return (
    <>
      <Nav></Nav>
      <div className='my-6 ml-20'>
        {selling ? (
          <>
            <div className='bg-black bg-opacity-50 ml-0.5 mr-8 rounded-md overflow-y-auto snap-y'>
              <div className='flex flex-row flex-wrap h-[328px]'>
                {sellingItems.map((item, index) => (
                  <Inventorycard key={index} item={item} selling={false} selected={true} removeItem={removeSale} />
                ))}
              </div>
              {/* Use absolute positioning to fix the button to the bottom */}
              <div className='flex justify-center'>
                {/* Open the modal for each item in the sellingItems array */}
                <button className='bg-green-500 hover:bg-green-600 p-2 m-2 rounded-sm' onClick={openModal}>
                  List Items
                </button>
              </div>
            </div>
          </>
        ) : <></>}
        {selling ? 
        <div className="flex flex-row mt-2.5 ml-2">
          <button
              className={`bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-red-800 
              font-bold text-lg py-4 px-8 rounded shadow-lg fixed bottom-8 right-9 z-10 cursor-pointer`}
              onClick={updateSelling}
            ><span className="mr-2"><XMarkIcon className="w-5 h-5 inline-block -mt-1" /></span>Cancel Selling</button>
          <p className="ml-8">Search: </p>
          <input
            type="text"
            value={invSearchQuery}
            onChange={handleInvSearch}
            placeholder="Search Item"
            className="text-black p-1 rounded-sm ml-2"
          />
        </div>
        : <button
              className={`bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-yellow-800 
              font-bold text-lg py-4 px-8 rounded shadow-lg fixed bottom-8 right-9 z-10 cursor-pointer`}
              onClick={updateSelling}
            ><span className="mr-2"><PlusIcon className="w-5 h-5 inline-block -mt-1" /></span>Sell Items</button>
        }
        <div className='flex flex-row flex-wrap'>
          {filteredInventory.map((item, index) => (
            <Inventorycard key={index} item={item} selling={selling} addItem={addSale} />
          ))}
        </div>
        {/* Render the modal when showModal is true */}
        {showModal && sellingItems[0] && (
        <div className="fixed inset-0 flex justify-center items-center bg-sky-950 p-3">
          <div className="bg-black bg-opacity-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Enter Prices for Items</h2>
            {/* ... (existing code) */}
            <div className="grid grid-cols-2 gap-4">
              {sellingItems.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center">
                    <span className="mr-2">{item.itemName}:</span>
                  </div>
                  <div className="flex flex-col items-center ml-auto mt-4">
                    <input
                      type="text"
                      placeholder="Price"
                      value={item.sellPrice || ''}
                      onChange={(e) =>
                        setSellingItems((prevSellingItems) =>
                          prevSellingItems.map((prevItem, i) =>
                            i === index ? { ...prevItem, sellPrice: e.target.value } : prevItem
                          )
                        )
                      }
                      className="border rounded-md p-1 w-40 text-black bg-white bg-opacity-90"
                    />
                    <div className='flex flex-row mt-1'>
                      <p className='text-xs text-gray-400'>Suggested Price: ${getLowest(item.itemName)}</p>
                      <InformationCircleIcon
                        className="w-4 h-4 inline-block ml-2 cursor-pointer"
                        onClick={(e) => toggleInfoWindow(e, index)}
                      />
                      {showInfoIndex === index && (
                        <div
                          className="bg-black bg-opacity-20 p-2 rounded-md absolute"
                          style={{ top: infoPosition.y, left: infoPosition.x + 30 }}
                        >
                          <div className="flex items-center justify-between">
                            <p className='text-sm text-gray-400'>The suggested price is the lowest price from these sites:</p>
                            <p
                              className="text-gray-400 text-sm font-bold cursor-pointer ml-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleInfoWindow(e, -1); // Hide the info popup when clicking on the "X"
                              }}
                            >
                              X
                            </p>
                          </div>
                          <div className='mt-2 grid grid-cols-2 gap-2'>
                            <p className='text-xs text-gray-400'>Buff Price: {SetPrice(item.itemName).buff}</p>
                            <p className='text-xs text-gray-400'>Steam Price: {SetPrice(item.itemName).steam}</p>
                            <p className='text-xs text-gray-400'>Skinport Price: {SetPrice(item.itemName).skinport}</p>
                            {/* <p className='text-xs text-gray-400'>CSMoney Price: {SetPrice(item.itemName).csmoney}</p> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Render the little window when showInfo is true */}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <button className={`bg-red-500 hover:bg-red-600 p-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={closeModal} disabled={isLoading}>
                Cancel
              </button>
              <button className={`bg-blue-500 hover:bg-blue-600 p-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={autoFillSuggestedPrices} disabled={isLoading}>
                Auto-Fill Suggested Price
              </button>
              <button
                className={`bg-green-500 hover:bg-green-600 p-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleItemPriceSubmit}
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
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

function getLowest(name: any) {
  const prices = Object.entries(SetPrice(name));
  var price = prices[0][1]
  var remove = price.replace("$", "");
  var min = parseFloat(remove);
  for (let index = 0; index < 4; index++) {
    const element = prices[index][1];
    remove = element.replace("$", "");
    var deci = parseFloat(remove);
    if(deci < min && deci > 0) {
      min = deci
    }
  }
  return min;
}
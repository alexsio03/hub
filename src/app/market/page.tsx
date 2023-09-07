"use client"
import { useState, useEffect } from 'react';
import MarketcardRandom from '../components/marketcardR';
import Nav from '../components/nav';
import ItemFilter from '../components/itemfilter';
import Marketcard from '../components/marketcard';
import SizeIcon from '../helpers/icons/sizeicon.js';

import PriceJSONData from '../helpers/prices/skinPrices.json';
import InfoJSONData from '../helpers/skindata.json';
import { collection, getDocs } from 'firebase/firestore';
import { initDB, initFirebase } from '../fb/config';

type ItemData = {
  itemName: string;
  itemIcon: any;
};

interface SkinAttributes {
  classid: string;
  exterior: string;
  first_sale_date: string;
  gun_type: string;
  icon_url: string;
  icon_url_large: string;
  marketable: number;
  name: string;
  rarity: string;
  rarity_color: string;
  stattrak: number;
  souvenir: number;
  tournament: string;
  tradable: number;
  type: string;
  weapon_type: string;
  knife_type: string;
}

// Initialize Firebase
initFirebase();
const db = initDB(); // Initialize the Firebase database.

export default function Market() {
  const [searchResults, setSearchResults] = useState<ItemData[]>([]);
  const [market, setMarket] = useState<any[]>([]);

  useEffect(() => {
    const loadMarket = async () => {
      const marketCollection = collection(db, "market");
      const marketSnap = await getDocs(marketCollection);
      const marketData = marketSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMarket(marketData);
    };

    loadMarket();
  }, []);
  
  useEffect(() => {
    // Parse the search parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');
    const souvenirRequested = Number(searchParams.get('souvenir'));
    const stattrakRequested = Number(searchParams.get('stattrak'));
    const permittedWears = searchParams.get('wear') || "no wear specified";
    const itemTypeRequested = searchParams.get('type') || "no type specified";
    
    if (searchQuery) {
      const skinData = Object.entries(InfoJSONData);
      const skinAttributes = Object.entries(skinData[3][1]);
      const skinPrices = Object.entries(PriceJSONData);

      const filteredItems = skinPrices
      .filter(([itemName]) => {
        const keywords = searchQuery.toLowerCase().split(" ");
        return keywords.every((keyword) =>
          itemName.toLowerCase().includes(keyword)
        );
      })
      .filter(([itemName]) => {
        const foundItem = skinAttributes.find((item) => item[0] === itemName);
        const itemData = foundItem ? (foundItem[1] as SkinAttributes) : undefined;
        console.log(itemData)
        if (foundItem == undefined){
          return false;
        }
        const itemIsStatTrak = itemData?.stattrak || 0;

        // Apply filtering for stattrakRequested
        if (stattrakRequested === 1 && itemIsStatTrak === 0) {
          return false;
        } else if (stattrakRequested === 2 && itemIsStatTrak === 1) {
          return false;
        }
        const itemIsSouvenir = itemData?.souvenir || 0;

        // Apply filtering for souvenirRequested
        if (souvenirRequested === 1 && itemIsSouvenir === 0) {
          return false;
        } else if (souvenirRequested === 2 && itemIsSouvenir === 1) {
          return false;
        }
        if (permittedWears == "no wear specified"){
          return true;
        }

        const itemWear = itemData?.exterior || "No Wear";

        const FNpermitted = Number(permittedWears?.charAt(0));
        const MWpermitted = Number(permittedWears?.charAt(1));
        const FTpermitted = Number(permittedWears?.charAt(2));
        const WWpermitted = Number(permittedWears?.charAt(3));
        const BSpermitted = Number(permittedWears?.charAt(4));

        if (FNpermitted == 1 && itemWear == "Factory New"){
          return true;
        }
        if (MWpermitted == 1 && itemWear == "Minimal Wear"){
          return true;
        }
        if (FTpermitted == 1 && itemWear == "Field-Tested"){
          return true;
        }
        if (WWpermitted == 1 && itemWear == "Well-Worn"){
          return true;
        }
        if (BSpermitted == 1 && itemWear == "Battle-Scarred"){
          return true;
        }
        if (itemTypeRequested == "no type specified"){
          return true;
        }

        const itemWeaponType = itemData?.weapon_type || "Not a Weapon";
        const itemGunType = itemData?.gun_type || "Not a Gun";
        const itemKnifeType = itemData?.knife_type || "Not a Gun";

        if (itemTypeRequested == itemGunType || itemTypeRequested == itemWeaponType || itemTypeRequested == itemKnifeType){
          return true;
        }
        return false;
      })
      .map(([itemName]) => {
        const foundItem = skinAttributes.find((item) => item[0] === itemName);
        return {
          itemName: itemName.replaceAll("&#39", "'"),
          itemIcon: foundItem ? SizeIcon(foundItem[1]) : null,
        }
      });
      
    setSearchResults(filteredItems);
    } else {
      // If no search parameter is present, just show the default components
      setSearchResults([]);
    }
  }, []);
  
  return (
  <>
    <Nav />
    <ItemFilter trade={false}/>
    <div className='m-6 flex flex-row flex-wrap'>
      {searchResults.length !== 0 ? (
        // Show the search results if searchParams exist
        searchResults.map((item, index) => (
          <Marketcard key={index} itemInfo={item} />
        ))
      ) : (market[0] ? market.map((sale) => ( <Marketcard key={sale.id} itemInfo={sale.itemInfo}/> )) : <p>Loading</p>)}
    </div>
  </>
  );
}
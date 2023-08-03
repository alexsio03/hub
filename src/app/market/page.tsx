"use client"
import { useState, useEffect } from 'react';
import MarketcardRandom from '../components/marketcardR';
import Nav from '../components/nav';
import ItemFilter from '../components/itemfilter';
import Marketcard from '../components/marketcard';
import SizeIcon from '../helpers/icons/sizeicon.js';

import PriceJSONData from '../helpers/prices/skinPrices.json';
import InfoJSONData from '../helpers/skindata.json';

type ItemData = {
  itemName: string;
  itemIsMarketable: number;
  itemIcon: any;
};

export default function Market() {
  const [searchResults, setSearchResults] = useState<ItemData[]>([]);
  
  useEffect(() => {
    // Parse the search parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');
    const souvenirRequested = Number(searchParams.get('souvenir'));
    const stattrakRequested = Number(searchParams.get('stattrak'));
    const permittedWears = searchParams.get('wear') || "no wear specified";
    
    if (searchQuery) {
      const skinAttributes = Object.entries(InfoJSONData.items_list);
      const skinPrices = Object.entries(PriceJSONData);

      const filteredItems = skinPrices
      .filter(([itemName]) => {
        const keywords = searchQuery.toLowerCase().split(" ");
        return keywords.every((keyword) =>
          itemName.toLowerCase().includes(keyword)
        );
      })
      .filter(([itemName]) => {
        const itemIsStatTrak = InfoJSONData.items_list[itemName].stattrak || 0;

        // Apply filtering for stattrakRequested
        if (stattrakRequested === 1 && itemIsStatTrak === 0) {
          return false;
        } else if (stattrakRequested === 2 && itemIsStatTrak === 1) {
          return false;
        }
        return true;
      })
      .filter(([itemName]) => {
        const itemIsSouvenir = InfoJSONData.items_list[itemName].souvenir || 0;

        // Apply filtering for souvenirRequested
        if (souvenirRequested === 1 && itemIsSouvenir === 0) {
          return false;
        } else if (souvenirRequested === 2 && itemIsSouvenir === 1) {
          return false;
        }
        return true;
      })
      .filter(([itemName]) => {
        if (permittedWears == "no wear specified"){
          return true;
        }

        const itemWear = InfoJSONData.items_list[itemName].exterior || "No Wear";

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
        return false;
      })
      .map(([itemName]) => ({
        itemName: itemName.replaceAll("&#39", "'"),
        itemIsMarketable: 1,
        itemIcon: skinAttributes.find((item) => item[0] == itemName) ? SizeIcon(skinAttributes.find((item) => item[0] == itemName)[1]) : null,
      }));
      
    setSearchResults(filteredItems);
    } else {
      // If no search parameter is present, just show the default components
      setSearchResults([]);
    }
  }, []);
  
  return (
  <>
    <Nav />
    <ItemFilter />
    <div className='m-6 flex flex-row flex-wrap'>
      {searchResults.length !== 0 ? (
        // Show the search results if searchParams exist
        searchResults.map((item, index) => (
          <Marketcard key={index} itemInfo={item} />
        ))
      ) : (
        // Show the default market page with random items if no search params exist
        // 21 items will be displayed
        Array.from({ length: 21 }, (_, index) => (
          <MarketcardRandom key={index} />
        ))
      )}
    </div>
  </>
  );
}
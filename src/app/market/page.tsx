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
      .slice(0, 40)
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
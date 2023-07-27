import React, { useState, useEffect } from 'react';
import SetPrice from '../helpers/prices/setprice.js';
import RandomSkin from '../helpers/randomskin.js';

// Used in market page to show random items upon first load
export default function ItemcardRandom() {
  const [itemInfo, setItemInfo] = useState({ name: '', icon: '', price: { steam: '', recency: '', buff: '' } });

  useEffect(() => {
    async function fetchRandomItem() {
      const randomItem = await RandomSkin();
      const name = randomItem.itemName || '';
      const icon = randomItem.itemIcon || '';
      const price = SetPrice(name);
      setItemInfo({ name, icon, price });
    }

    fetchRandomItem();
  }, []);

  const { name, icon, price } = itemInfo;

  return (
    <div className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] m-2 p-1 items-center w-52 h-64 overflow-hidden relative drop-shadow-lg rounded-sm">
      <div className="flex flex-col p-2">
        <h6 className='h-14 text-md'>{name}</h6>
        <img className="mx-auto object-contain w-32 h-32" src={icon} alt={name} />
        {price && price.steam && (
          <p className="text-xs opacity-50">Steam Price: {price.steam} {price.recency}</p>
        )}
        {price && price.buff && (
          <p className="text-xs opacity-50">Buff price: {price.buff}</p>
        )}
      </div>
    </div>
  );
}
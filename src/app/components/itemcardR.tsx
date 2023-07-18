import React, { useState, useEffect } from 'react';
import SetPrice from '../helpers/prices/setprice.js';
import RandomSkin from '../helpers/randomskin.js';

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
    <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
      <div className="flex flex-col p-3">
        <h3>{name}</h3>
        {price && price.steam && (
          <p className="text-xs">Steam Price: {price.steam} {price.recency}</p>
        )}
        {price && price.buff && (
          <p className="text-xs">Buff price: {price.buff}</p>
        )}
      </div>
      <img className="mx-auto object-contain w-32 h-32" src={icon} alt={name} />
    </div>
  );
}

"use client"
import React from 'react';
import SetPrice from '../helpers/prices/setprice.js';
import RandomSkin from '../helpers/randomskin.js';

export default function ItemcardRandom() {
    const [itemName, setItemName] = React.useState('');
    const [itemIcon, setItemIcon] = React.useState('');
    const [priceData, setPriceData] = React.useState({ steam: '', recency: '', buff: '' });

    React.useEffect(() => {
        async function fetchData() {
            const randomItem = await RandomSkin();
            const name = randomItem.itemName;
            const icon = randomItem.itemIcon;
            const price = SetPrice(name);
            setItemName(name);
            setItemIcon(icon);
            setPriceData(price);
        }
        fetchData();
    }, []);

    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
            <div className="flex flex-col p-3">
                <h3>{itemName}</h3>
                <p className="text-xs">Steam Price: {priceData.steam} {priceData.recency}</p>
                <p className="text-xs">Buff price: {priceData.buff}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={itemIcon} alt={itemName} />
        </div>
    );
}
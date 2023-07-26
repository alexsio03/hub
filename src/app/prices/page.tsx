"use client"
import Nav from '../components/nav';
import skindata from "../helpers/skindata.json"
import skinprices from '../helpers/prices/skinPrices.json'
import Itemcard from '../components/itemcard';
import { useState, MouseEvent, useCallback } from "react";
import SizeIcon from '../helpers/icons/sizeicon';
import findImage from '../helpers/findImage';

export default function Prices() {
    const [searchQuery, setSearchQuery] = useState("");

    const skinArr = Object.entries(skindata.items_list);
    const skinPrices = Object.entries(skinprices);
    const filteredItems = skinPrices
    .filter(([itemName]) => {
        const keywords = searchQuery.toLowerCase().split(" ");
        return keywords.every((keyword) =>
        itemName.toLowerCase().includes(keyword)
        );
    })
    .slice(0, 20)
    .map(([itemName, itemInfo]) => ({
        itemName: itemName.replaceAll("&#39", "'"),
        id: hash(itemName),
        itemIcon: skinArr.find((item) => item[0] == itemName) ? SizeIcon(skinArr.find((item) => item[0] == itemName)[1]) : null,
        priceData: itemInfo
    }));
    
    const [item, setItem] = useState()
    const [priceData, setPriceData] = useState()
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const onMouseMove = useCallback(
        throttle((e: MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;
        const rotateX = (y - centerY) / 1000;
        const rotateY = (centerX - x) / 1000;

        setRotate({ x: rotateX, y: rotateY });
        }, 100),
        []
    );

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    function handleItemRequested(clickedItem) {
        console.log(clickedItem.priceData)
        setItem(clickedItem)
        setPriceData(clickedItem.priceData)
    }

    return (
        <>
            <Nav></Nav>
            <div className='m-3 mr-8 flex flex-row'>
                <div className='w-1/2 flex items-center flex-col'>
                    <div>
                        <div className="flex flex-row">
                            <p className="mt-1">Search: </p>
                            <input
                                value={searchQuery}
                                onChange={handleSearch}
                                type="text"
                                placeholder="AWP"
                                className="text-black p-1 rounded-sm ml-2"
                            />
                        </div>
                    </div>
                    <div className='flex flex-row flex-wrap justify-center h-[820px] mr-8 overflow-y-auto snap-y'>
                        {filteredItems.map((skin, index) => (
                            <button key={index} onClick={() => handleItemRequested(skin)} className="item-button snap-start">
                                {<Itemcard itemData={skin} />}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='w-1/2 h-1/2 m-auto bg-gradient-to-br from-sky-700 to-cyan-700 p-8 rounded-lg'
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{
                    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                    transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
                }}>
                    <div className='flex justify-center text-xl'>
                        <h2>{item?.itemName ? item.itemName : "CLICK ON AN ITEM FOR PRICE DATA"}</h2>
                    </div>
                    <div className='flex justify-center'>
                        <img className="mx-auto object-contain w-64 h-64" src={item ? findImage(item.itemName) : "https://static.thenounproject.com/png/899817-200.png"}></img>
                    </div>
                    <div className='flex flex-row px-10 justify-between'>
                        <div className='flex flex-col flex-1 pl-12 space-y-8 leading-loose tracking-wide text-lg'>
                            <p>Buff163: {priceData?.buff163?.starting_at?.price ? "$" + priceData.buff163.starting_at.price : "None Currently Listed"}</p>
                            <p>Skinport: {priceData?.skinport?.starting_at ? "$" + priceData.skinport.starting_at : "None Currently Listed"}</p>
                            <p>CSMoney: {priceData?.csmoney?.price ? "$" + priceData.csmoney.price : "None Currently Listed"}</p>
                        </div>
                        <div className='flex flex-col flex-1 pl-24 space-y-8 leading-loose tracking-wide text-lg'>
                            <p>Steam: {priceData?.steam ? getSteamPrice(priceData.steam) : "None Currently Listed"}</p>
                            <p>BitSkins: {priceData?.bitskins?.price ? "$" + priceData.bitskins.price : "None Currently Listed"}</p>
                            <p>CSGOEmpire: {priceData?.csgoempire ? "$" + priceData.csgoempire : "None Currently Listed"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function getSteamPrice(steamData) {
    if(steamData.last_24h) {
        return "$" + steamData.last_24h + " (24 hours)"
    } else if (steamData.last_7d) {
        return "$" + steamData.last_7d + " (7 days)"
    } else if (steamData.last_30d) {
        return "$" + steamData.last_30d + " (30 days)"
    } else {
        return "$" + steamData.last_90d + " (90 days)"
    }
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
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
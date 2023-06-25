import data from '../skin-info/skins.json';
import priceData from '../skin-info/skinPrices.json';
import RandomSkin from '../helpers/randomskin.js';

export default function ItemcardRandom() {
    // Ideally prices in skinPrices.json get refreshed by 'curling' prices.csgotrader.app/latest/prices_v6.json every 12 hours
    const randomItemInfo = RandomSkin();
    const itemToDisplay = data[randomItemInfo.RandomSkin];
    const randomWear = randomItemInfo.RandomWear;
    const itemName = itemToDisplay.name + " " + randomWear;
    const itemImage = itemToDisplay.image;
    let priceSteam = null;
    let steamPriceRecency = "0";
    let priceBuff = null;

    for (let skin in priceData){
        if (skin == itemName){
            // Steam pricing
            if (priceData[skin as keyof typeof priceData]['steam']['last_24h'] != 0){
                priceSteam = priceData[skin as keyof typeof priceData]['steam']['last_24h'];
                steamPriceRecency = "(24h)";
            } else if (priceData[skin as keyof typeof priceData]['steam']['last_7d'] != 0){
                priceSteam = priceData[skin as keyof typeof priceData]['steam']['last_7d'];
                steamPriceRecency = "(7d)";
            } else if (priceData[skin as keyof typeof priceData]['steam']['last_30d'] != 0){
                priceSteam = priceData[skin as keyof typeof priceData]['steam']['last_30d'];
                steamPriceRecency = "(30d)";
            } else if (priceData[skin as keyof typeof priceData]['steam']['last_90d'] != 0){
                priceSteam = priceData[skin as keyof typeof priceData]['steam']['last_90d'];
                steamPriceRecency = "(90d)";
            } else {
                priceSteam = "Unknown";
                steamPriceRecency = "(>90d)";
            }
            // Buff pricing
            try {
                priceBuff = priceData[skin as keyof typeof priceData]['buff163']['starting_at.price'];
            } catch (error){
                priceBuff = "Unknown";
            }
        }
    }
    
    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
            <div className="flex flex-col p-3">
                <h3>{itemName}</h3>
                <p className="text-xs">Steam Price: ${priceSteam} {steamPriceRecency}</p>
                <p className="text-xs">Buff price: ${priceBuff}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={itemImage}/>
        </div>
    )
}
import SetPrice from '../helpers/setprice.js'
import RandomSkin from '../helpers/randomskin.js';

export default async function ItemcardRandom() {
    // Ideally prices in skinPrices.json get refreshed by 'curling' prices.csgotrader.app/latest/prices_v6.json every 12 hours
    const randomItem = await RandomSkin();
    const itemName = randomItem.itemName;
    const itemIcon = randomItem.itemIcon;
    const priceData = SetPrice(itemName);
    
    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
            <div className="flex flex-col p-3">
                <h3>{itemName}</h3>
                <p className="text-xs">Steam Price: {priceData.steam} {priceData.recency}</p>
                <p className="text-xs">Buff price: {priceData.buff}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={itemIcon}/>
        </div>
    )
}
import PriceJSON from '../skin-info/skinPrices.json';

export default function Itemcard(item: { itemInfo: any; }) {
    let myinfo = item.itemInfo;
    const itemName = myinfo.itemName;
    let imgData = myinfo.itemIcon;
    const imgURL1 = "https://community.cloudflare.steamstatic.com/economy/image/";
    const imgURL2 = "/330x192";
    const itemImage = imgURL1 + imgData + imgURL2;

    if (!myinfo.itemIsMarketable){
        return (
            <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
                <div className="flex flex-col p-3">
                    <h3>{itemName}</h3>
                </div>
                <img className="mx-auto object-contain w-32 h-32" src={itemImage}/>
            </div>
        )
    }

    const priceData = SetPrice(itemName);

    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
            <div className="flex flex-col p-3">
                <h3>{itemName}</h3>
                <p className="text-xs">Steam Price: {priceData.steam} {priceData.recency}</p>
                <p className="text-xs">Buff price: {priceData.buff}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={itemImage}/>
        </div>
    )
}

function SetPrice(itemName: string){
    let priceSteam = "No Data";
    let steamPriceRecency = "0";
    let priceBuff = "No Data";
    for (let skin in PriceJSON){
        if (skin == itemName){
            // Steam pricing
            if (PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_24h'] != 0){
                priceSteam = "$" + PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_24h'];
                steamPriceRecency = "(24h)";
            } else if (PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_7d'] != 0){
                priceSteam = "$" + PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_7d'];
                steamPriceRecency = "(7d)";
            } else if (PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_30d'] != 0){
                priceSteam = "$" + PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_30d'];
                steamPriceRecency = "(30d)";
            } else if (PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_90d'] != 0){
                priceSteam = "$" + PriceJSON[skin as keyof typeof PriceJSON]['steam']['last_90d'];
                steamPriceRecency = "(90d)";
            } else {
                priceSteam = "Unknown";
                steamPriceRecency = "(>90d)";
            }
            // Buff pricing
            priceBuff = "$" + PriceJSON[skin as keyof typeof PriceJSON]['buff163']['starting_at']['price'];
        }
    }
    return {
        steam: priceSteam,
        recency: steamPriceRecency,
        buff: priceBuff
    };
}
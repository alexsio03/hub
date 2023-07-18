import SetIcon from '../helpers/icons/seticon.js';
import SetPrice from '../helpers/prices/setprice.js';

export default function Itemcard({item}) {
    const itemData = item.itemInfo ? item.itemInfo : item;
    const itemName = itemData.itemName;
    var imgData;
    if(itemData.itemIcon) {
        imgData = itemData.itemIcon;
    } else {
        if(itemData.itemData) {imgData = SetIcon(itemData.itemData[1]);}
    }
    const imgURL1 = "https://community.cloudflare.steamstatic.com/economy/image/";
    const imgURL2 = "/330x192";
    const itemImage = imgURL1 + imgData + imgURL2;

    if (!itemData.itemIsMarketable){
        return (
            <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-44 h-64">
                <div className="flex flex-col p-3">
                    <h3>{itemName}</h3>
                </div>
                <img className="mx-auto object-contain w-32 h-32" src={itemImage} alt={itemData.id}/>
            </div>
        )
    }

    const priceData = SetPrice(itemName);

    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-44 h-64">
            <div className="flex flex-col p-3">
                <h3>{itemName}</h3>
                <p className="text-xs">Steam Price: {priceData.steam} {priceData.recency}</p>
                <p className="text-xs">Buff price: {priceData.buff}</p>
            </div>
            <img className="mx-auto object-contain w-32 h-32" src={itemImage} alt={itemData.id} />
        </div>
    )
}
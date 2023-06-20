import data from '../skin-info/skins.json';
import priceData from '../skin-info/skinPrices.json';

export default function Itemcard(item) {
    let myinfo = item.itemInfo;
    console.log(myinfo.itemName);
    return (
        <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60">
            <div className="flex flex-col p-3">
                <h3>{}</h3>
                <p className="text-xs">Steam Price</p>
                <p className="text-xs">Buff price</p>
            </div>
        </div>
    )
}
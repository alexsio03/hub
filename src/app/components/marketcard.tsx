import Itemcard from "./itemcard"
import data from '../skin-info/skins.json';

export default function Marketcard(listing) {
    const itemToDisplay = listing.itemNum;
    const itemName = itemToDisplay.name;
    const itemImage = itemToDisplay.image;
    return (
        <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col w-80 mx-auto">
            <div className="p-2">
                <h1>{itemName}</h1>
            </div>
            <div className="flex flex-col">
                <Itemcard
                price="$1" steamprice="$2"
                img={itemImage}></Itemcard>
            </div>
                <h2>{listing.ourPrice}</h2>
        </div>
    )
}
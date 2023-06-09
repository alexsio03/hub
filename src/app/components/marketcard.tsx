import Itemcard from "./itemcard"

export default function Marketcard(listing) {
    return (
        <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col w-80 mx-auto">
            <div className="p-2">
                <h1>{listing.itemName}</h1>
            </div>
            <div className="flex flex-col">
                <Itemcard
                price="$2000" steamprice="$2500"
                img="https://www.csgodatabase.com/images/knives/webp/Karambit_Doppler.webp"></Itemcard>
            </div>
                <h2>{listing.ourPrice}</h2>
        </div>
    )
}
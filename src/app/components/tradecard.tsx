import Itemcard from "./itemcard"

export default function Tradecard(props) {
    return (
        <div className="bg-[#8a1520] rounded-lg my-6 p-1 flex flex-col">
            <div className="p-2">
                <h1>{props.user}</h1>
            </div>
            <div className="flex flex-row justify-center">
                <div className="bg-[#452427] m-3 p-3 rounded-xl">
                    <h1>Offering:</h1>
                    <Itemcard itemname="Karambit Doppler" 
                    price="$2500" steamprice="$3500"
                    img="https://www.csgodatabase.com/images/knives/webp/Karambit_Doppler.webp"></Itemcard>
                </div>
                <div className="bg-[#452427] m-3 p-3 rounded-xl">
                    <h1>Requesting:</h1>
                    <Itemcard itemname="Bayonet Doppler" 
                    price="$1700" steamprice="$2800"
                    img="https://www.csgodatabase.com/images/knives/webp/Bayonet_Doppler.webp"></Itemcard>
                </div>
            </div>
        </div>
    )
}
import Itemcard from "./itemcard";
import ItemcardRandom from "./itemcardR";

export default function Tradecard(props) {
    return (
        <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col max-w-lg mx-auto">
            <div className="p-2">
                <h1>{props.user}</h1>
            </div>
            <div className="flex flex-col">
                <div className="bg-[#452427] mx-6 my-3 p-3 rounded-xl">
                    <h1>Offering:</h1>
                    <div className="flex flex-row">
                        <ItemcardRandom></ItemcardRandom>
                        <ItemcardRandom></ItemcardRandom>
                    </div>
                    <h1>Requesting:</h1>
                        <ItemcardRandom></ItemcardRandom>
                </div>
            </div>
        </div>
    )
}
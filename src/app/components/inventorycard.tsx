import Itemcard from "./itemcard";

export default function Inventorycard(item: any) {
    return (
        <div className="bg-[#2b2222] rounded-lg mt-3 p-1 flex flex-col w-60 mx-auto">
            <Itemcard itemData={item.itemInfo}></Itemcard>
        </div>
    )
}
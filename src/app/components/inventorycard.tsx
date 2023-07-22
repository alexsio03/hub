import Itemcard from "./itemcard";

export default function Inventorycard(item: any) {
    return (
        <div className="bg-[#2b2222] rounded-lg m-3 p-1 flex flex-col w-60">
            <Itemcard itemData={item.itemInfo}></Itemcard>
        </div>
    )
}
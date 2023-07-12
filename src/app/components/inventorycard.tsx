import Itemcard from "./itemcard";

export default function Inventorycard(item: any) {
    const itemInformation = item.itemInfo;
    return (
        <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col w-80 mx-auto">
            <Itemcard itemInfo={itemInformation}></Itemcard>
        </div>
    )
}
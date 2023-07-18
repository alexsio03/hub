import Itemcard from "./itemcard";

export default function Inventorycard(item: any) {
    return (
        <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col w-52 mx-auto">
            <Itemcard item={item}></Itemcard>
        </div>
    )
}
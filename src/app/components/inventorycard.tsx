import Itemcard from "./itemcard";

export default function Inventorycard({ item, selling, selected, addItem, removeItem }: any) {
    const handleAdd = () => {
        addItem(item);
    };

    const handleRem = () => {
        removeItem(item);
    };

    return (
        <div className="bg-sky-800 rounded-lg m-3 p-1 flex flex-col">
            <Itemcard itemData={item}></Itemcard>
            {(selling && item.itemIsMarketable) ? <button onClick={handleAdd}>Add Item</button> : <></>}
            {selected ? <button onClick={handleRem}>Remove Item</button> : <></>}
        </div>
    )
}

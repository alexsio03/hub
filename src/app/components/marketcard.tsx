import Itemcard from "./itemcard";

export default function Marketcard(item: { itemInfo: any; }) {
  return (
    <div className="bg-sky-800 rounded-lg m-3 p-1 flex flex-col">
      <Itemcard itemData={item.itemInfo}></Itemcard>
    </div>
  )
}
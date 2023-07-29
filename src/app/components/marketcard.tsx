import Itemcard from "./itemcard";

export default function Marketcard(item: { itemInfo: any; }) {
  // integrate db and access all listings here
  // search for the item in db to check if it exists, return modified card here
  var hasListings = false;
  if (hasListings){
    return (
      <div className="bg-sky-800 rounded-lg m-3 p-1 flex flex-col">
        <Itemcard itemData={item.itemInfo}></Itemcard>
      </div>
    )
  }

  // otherwise return card with default information
  return (
    <div className="bg-sky-800 rounded-lg m-3 p-1 flex flex-col">
      <Itemcard itemData={item.itemInfo}></Itemcard>
    </div>
  )
}
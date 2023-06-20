import Nav from '../components/nav';
import data from '../helpers/wakInv.json'; // Won't be needed once inventory accessing works with loadinventory.js
import LoadInventory from '../helpers/loadinventory.js';
import Itemcard from '../components/itemcard';

export default function Inventory(){
  const inventoryItemIDs = [];
  let i = 0;
  // data['rgDescriptions'][item].appid
  // 
  for (let item in data['rgDescriptions']){
    let currentItem = {
      itemIcon: data['rgDescriptions'][item].icon_url,
      itemName: data['rgDescriptions'][item].market_name,
      itemTradeStatus: data['rgDescriptions'][item].tradable, // 0 or 1 (1 can be traded)
      itemDateTradable: data['rgDescriptions'][item].cache_expiration
    };
    inventoryItemIDs[i] = currentItem;
    i++;
  }

  return(
    <div className='m-6'>
      <Nav></Nav>
      <div className='flex flex-row flex-wrap'>
        {inventoryItemIDs.map(item=><Itemcard itemInfo={item}></Itemcard>)}
      </div>
    </div>
  )
}
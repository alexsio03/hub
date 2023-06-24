import Nav from '../components/nav';
import data from '../helpers/wakInv.json'; // Won't be needed once inventory accessing works with loadinventory.js
import LoadInventory from '../helpers/loadinventory.js';
import Itemcard from '../components/itemcard';
import Inventorycard from "../components/inventorycard";

export default function Inventory(/*steamid*/){
  // const data = LoadInventory(); // THIS WORKS, but commented out to not get rate limited
  const itemsInInventory = [];
  let i = 0;
  for (let item in data['rgDescriptions']){
    let currentItem = {
      itemIcon: data['rgDescriptions'][item].icon_url,
      itemIconBig: data['rgDescriptions'][item].icon_url_large,
      itemName: data['rgDescriptions'][item].market_name,
      itemTradeStatus: data['rgDescriptions'][item].tradable, // 0 or 1 (1 can be traded)
      itemDateTradable: data['rgDescriptions'][item].cache_expiration
    };
    itemsInInventory[i] = currentItem;
    i++;
  }

  return(
    <div className='m-6'>
      <Nav></Nav>
      <div className='flex flex-row flex-wrap'>
        {itemsInInventory.map(itemInformation=><Inventorycard itemInfo={itemInformation}></Inventorycard>)}
      </div>
    </div>
  )
}
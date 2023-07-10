import Nav from '../components/nav';
import data from '../helpers/wakInv.json'; // Won't be needed once inventory accessing works with loadinventory.js
import Inventorycard from '../components/inventorycard';
import SetIcon from '../helpers/seticon.js';

export default function Inventory(/*steamid*/){
  // const data = LoadInventory(); // THIS WORKS, but commented out to not get rate limited
  const itemsInInventory = [];
  let i = 0;
  for (let item in data['rgDescriptions']){
    let marketable = data['rgDescriptions'][item as keyof typeof data['rgDescriptions']].marketable;

    let currentItem = {
      itemIcon: SetIcon(item),
      itemName: data['rgDescriptions'][item as keyof typeof data['rgDescriptions']].market_name,
      itemIsMarketable: marketable, // 0 or 1 (1 can be marketed)
      itemTradeStatus: data['rgDescriptions'][item as keyof typeof data['rgDescriptions']].tradable, // 0 or 1 (1 can be traded)
      //itemDateTradable: marketable ? data['rgDescriptions'][item as keyof typeof data['rgDescriptions']].cache_expiration : 'notmarketable',
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
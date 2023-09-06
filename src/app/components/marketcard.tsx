import SetPrice from '../helpers/prices/setprice.js';
import findImage from '../helpers/findImage.js'; 

export default function Marketcard(item: { itemInfo: any; }) {
  // Destructure the properties from the 'item' object
  const { itemName, itemIcon } = item.itemInfo;

  // Get the price data for the item if it is marketable, otherwise set to null
  const priceData = SetPrice(itemName) || 0;

  // Set the itemUrl to the itemIcon URL if it exists, otherwise find the image using the item name
  const itemUrl = itemIcon ? `https://community.cloudflare.steamstatic.com/economy/image/${itemIcon}/330x192` : findImage(itemName);

  // integrate db and access all listings here
  // search for the item in db to check if it exists, return normal card here
  var hasListings = false;
  if (hasListings){
    return (
      <div className="bg-sky-800 rounded-lg m-3 p-1 flex flex-col">
        <a href={`/item/${itemName}`} className="bg-sky-500 hover:bg-sky-400 hover:scale-[1.025] m-2 p-1 items-center w-52 h-64 overflow-hidden relative drop-shadow-lg rounded-sm">
          <div className="flex flex-col p-2">
            <h6 className='h-14 text-md'>{itemName}</h6>
            <img className="mx-auto object-contain w-32 h-32" src={itemUrl} />
            {priceData && (
              // Display price data if it exists
              <>
                <p className="text-xs opacity-50">Sale Price: {item.itemInfo.sellPrice}</p>
                <p className="text-xs opacity-50">Steam: {priceData.steam} {priceData.recency}</p>
                <p className="text-xs opacity-50">Buff: {priceData.buff}</p>
              </>
            )}
          </div>
        </a>
      </div>
    )
  }

  // otherwise return darker card that does not redirect
  return (
    <div className='bg-sky-900 rounded-lg m-3 p-1 flex flex-col'>
      <div className="bg-sky-800 m-2 p-1 items-center w-52 h-64 overflow-hidden relative drop-shadow-lg rounded-sm">
        <div className="flex flex-col p-2">
          <h6 className='h-14 text-md'>{itemName}</h6>
          <img className="mx-auto object-contain w-32 h-32" src={itemUrl} />
          {priceData && (
            // Display price data if it exists
            <>
              <p className="text-sm opacity-80">Sale Price: ${item.itemInfo.sellPrice}</p>
              <p className="text-xs opacity-50">Steam: {priceData.steam} {priceData.recency}</p>
              <p className="text-xs opacity-50">Buff: {priceData.buff}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
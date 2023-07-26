import SetPrice from '../helpers/prices/setprice.js';
import magnifyingGlassImage from './images/magnifyingglass.png';
import findImage from '../helpers/findImage.js'

export default function Itemcard(item: any) {
  const { id, itemName, itemIcon, itemInspectLink, itemIsMarketable } = item.itemData;
  const priceData = itemIsMarketable ? SetPrice(itemName) : null;
  const cleanedLink = itemInspectLink ? itemInspectLink.replace(/["']/g, '') : '';
  const itemUrl = itemIcon ? `https://community.cloudflare.steamstatic.com/economy/image/${itemIcon}/330x192` : findImage(itemName)

  return (
  <div className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] m-2 p-1  items-center w-52 h-64 overflow-hidden relative drop-shadow-lg rounded-sm">
    <div className="flex flex-col p-2">
      <h6 className='h-14 text-md'>{itemName}</h6>
      <img className="mx-auto object-contain w-32 h-32" src={itemUrl} alt={id} />
      {priceData && (
      <>
      <p className="text-xs opacity-50">Buff: {priceData.buff}</p>
      <p className="text-xs opacity-50">Steam: {priceData.steam} {priceData.recency}</p>
      </>
      )}
    </div>
    {itemInspectLink && (
    <div className="absolute bottom-2 right-2">
      <a href={cleanedLink} target="_blank" rel="noopener noreferrer">
      <img className="w-6 h-6 bg-blue-500 bg-opacity-70 hover:bg-blue-600 rounded-md p-1" src={magnifyingGlassImage.src} alt="Magnifying Glass" />
      </a>
    </div>
    )}
  </div>
  );
}
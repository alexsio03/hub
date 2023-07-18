import SetPrice from '../helpers/prices/setprice.js';
import magnifyingGlassImage from './images/magnifyingglass.png';

export default function Itemcard(item: any) {
  const { itemName, itemIcon, itemInspectLink, itemIsMarketable } = item.itemData;
  const priceData = itemIsMarketable ? SetPrice(itemName) : null;
  const cleanedLink = itemInspectLink ? itemInspectLink.replace(/["']/g, '') : '';

  return (
    <div className="bg-neutral-900 m-3 p-1 items-center rounded-xl w-74 h-60 relative">
      <div className="flex flex-col p-3">
        <h3>{itemName}</h3>
        {priceData && (
          <>
            <p className="text-xs">Steam Price: {priceData.steam} {priceData.recency}</p>
            <p className="text-xs">Buff price: {priceData.buff}</p>
          </>
        )}
      </div>
      <img className="mx-auto object-contain w-32 h-32" src={itemIcon} alt="Item Image" />
      {itemInspectLink && (
        <div className="absolute bottom-2 right-2">
          <a href={cleanedLink} target="_blank" rel="noopener noreferrer">
            <img className="w-6 h-6" src={magnifyingGlassImage.src} alt="Magnifying Glass" />
          </a>
        </div>
      )}
    </div>
  );
}
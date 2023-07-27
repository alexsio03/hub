// Import necessary modules and helper functions
import SetPrice from '../helpers/prices/setprice.js'; // Module to get price data for items
import magnifyingGlassImage from './images/magnifyingglass.png'; // Image of a magnifying glass for inspect link
import findImage from '../helpers/findImage.js'; // Helper function to find the item image

// Component to display individual item cards
export default function Itemcard(item: any) {
  // Destructure the properties from the 'item' object
  const { id, itemName, itemIcon, itemInspectLink, itemIsMarketable } = item.itemData;

  // Get the price data for the item if it is marketable, otherwise set to null
  const priceData = itemIsMarketable ? SetPrice(itemName) : null;

  // Remove quotes from the itemInspectLink if it exists, otherwise set to an empty string
  const cleanedLink = itemInspectLink ? itemInspectLink.replace(/["']/g, '') : '';

  // Set the itemUrl to the itemIcon URL if it exists, otherwise find the image using the item name
  const itemUrl = itemIcon ? `https://community.cloudflare.steamstatic.com/economy/image/${itemIcon}/330x192` : findImage(itemName);

  // Return the JSX for the individual item card
  return (
    <div className="bg-sky-700 hover:bg-sky-600 hover:scale-[1.025] m-2 p-1 items-center w-52 h-64 overflow-hidden relative drop-shadow-lg rounded-sm">
      <div className="flex flex-col p-2">
        <h6 className='h-14 text-md'>{itemName}</h6>
        <img className="mx-auto object-contain w-32 h-32" src={itemUrl} alt={id} />
        {priceData && (
          // Display price data if it exists
          <>
            <p className="text-xs opacity-50">Steam: {priceData.steam} {priceData.recency}</p>
            <p className="text-xs opacity-50">Buff: {priceData.buff}</p>
          </>
        )}
      </div>
      {itemInspectLink && (
        // Display inspect link icon if itemInspectLink exists
        <div className="absolute bottom-2 right-2">
          <a href={cleanedLink} target="_blank" rel="noopener noreferrer">
            <img className="w-6 h-6 bg-blue-500 bg-opacity-70 hover:bg-blue-600 rounded-md p-1" src={magnifyingGlassImage.src} alt="Magnifying Glass" />
          </a>
        </div>
      )}
    </div>
  );
}

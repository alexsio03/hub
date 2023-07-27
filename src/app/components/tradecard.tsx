// Importing necessary dependencies and components
import PropTypes from 'prop-types'; // Library for type checking of props
import { initDB, initFirebase } from "../fb/config"; // Firebase database initialization
import { doc, collection, deleteDoc } from "firebase/firestore"; // Firebase Firestore functions
import Itemcard from './itemcard'; // Component to display individual item details
import SetPrice from '../helpers/prices/setprice'; // Function to get item prices
import { useState, MouseEvent, useCallback } from "react"; // React hooks for state management and event handling

// Initialize Firebase and Firestore
initFirebase();
const db = initDB();

// Main TradeCard component
const TradeCard = ({ owner, owner_url, offers, requests, is_owner, id, onDeleteTrade }) => {
  // Function to handle trade deletion
  const handleDelete = async () => {
    try {
      // Get the reference to the "trades" collection
      const tradesRef = collection(db, 'trades');

      // Delete the trade document with the given ID
      await deleteDoc(doc(tradesRef, id));

      // The trade has been successfully deleted
      console.log('Trade deleted successfully.');
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  // State for handling the rotation of the trade card on mouse move
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // Callback function to update the card rotation on mouse move
  const onMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 1000;
      const rotateY = (centerX - x) / 1000;

      setRotate({ x: rotateX, y: rotateY });
    }, 100),
    []
  );

  // Function to reset the card rotation on mouse leave
  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    // Trade card with rotation effect on mouse move
    <div
      className="bg-gradient-to-br from-cyan-700 to-sky-600 my-6 flex flex-col relative w-full shadow-lg shadow-sky-600/50"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
        transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
      }}
    >
      {/* Trade owner section */}
      <div className="p-2 mt-2">
        <h1 className="text-white text-xl">
          Trade Owner: <a className='hover:underline' href={owner_url}>{owner}</a>
        </h1>
      </div>

      {/* Sections for offering and requesting items */}
      <div className="flex flex-row justify-between divide-x-2 divide-sky-950">
        <Section title="Offering" items={offers} />
        <Section title="Requesting" items={requests} />
      </div>

      {/* Delete button for trade owner */}
      {is_owner ? 
      <div className="flex justify-end border-t-2 border-sky-950">
        <button onClick={() => onDeleteTrade(id)} className="bg-red-500  hover:bg-red-600 my-2 mr-2 rounded-md text-white font-semibold py-1 px-2">Delete</button>
      </div>
      : <></>}
    </div>
  );
};

// Section component to display items in the trade
const Section = ({ title, items }) => {
  return (
    <div className="mt-2 p-3 border-t-2 border-sky-950 min-h-[336px] w-1/2">
      <h1 className="text-white tracking-wide text-lg font-bold mb-2">{title}:</h1>
      <h4 className='text-sm'>Total Buff Price: ${getTotal(items)}</h4>
      <div className="flex flex-wrap -mx-2">
        {/* Render each item using the Itemcard component */}
        {items.map((item, index) => (
          <Itemcard key={index} itemData={item} />
        ))}
      </div>
    </div>
  );
};

// Function to calculate the total Buff price of the items
function getTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    const priceData = SetPrice(items[i].itemName);
    total += Number(priceData.buff.substring(1));
  }
  return total.toFixed(2);
}

// Prop types validation for the TradeCard and Section components
TradeCard.propTypes = {
  owner: PropTypes.string.isRequired,
  owner_url: PropTypes.string.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  requests: PropTypes.arrayOf(PropTypes.object).isRequired,
  is_owner: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  onDeleteTrade: PropTypes.func.isRequired,
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

// Throttle function to limit the rate of calling a function
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

// Exporting the TradeCard component as the default export
export default TradeCard;

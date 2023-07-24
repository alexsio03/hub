import PropTypes from 'prop-types';
import { initDB, initFirebase } from "../fb/config";
import { doc, collection, deleteDoc } from "firebase/firestore";
import Itemcard from './itemcard';
import SetPrice from '../helpers/prices/setprice';

initFirebase();
const db = initDB();

const TradeCard = ({ owner, owner_url, offers, requests, is_owner, id, onDeleteTrade }) => {
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

  return (
    <div className="bg-[#2b2222] rounded-lg my-6 p-1 flex flex-col relative w-11/12">
      <div className="p-2">
        <h1 className="text-white text-xl">Trade Owner: <a className='hover:underline' href={owner_url}>{owner}</a></h1>
      </div>
      <div className="flex flex-row justify-between">
        <Section title="Offering" items={offers} />
        <Section title="Requesting" items={requests} />
      </div>
      <div className="m-2 flex justify-end">
        {is_owner ? 
        <>
          <button onClick={() => onDeleteTrade(id)} className="bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold py-1 px-2">Delete</button>
        </>
        : <></>}
      </div>
    </div>
  );
};

const Section = ({ title, items }) => {
  return (
    <div className="bg-[#452427] mx-2 my-3 p-2 rounded-xl min-h-[336px] w-1/2">
      <h1 className="text-white tracking-wide text-lg font-bold mb-2">{title}:</h1>
      <h4 className='text-sm'>Total Buff Price: ${getTotal(items)}</h4>
      <div className="flex flex-wrap -mx-2">
        {items.map((item, index) => (
          <Itemcard key={index} itemData={item} />
        ))}
      </div>
    </div>
  );
};

function getTotal(items) {
  var total = 0;
  for(var i = 0; i < items.length; i++) {
    const priceData = SetPrice(items[i].itemName);
    total += Number(priceData.buff.substring(1));
  }
  return total.toFixed(2);
}

TradeCard.propTypes = {
  user: PropTypes.string.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  requests: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TradeCard;

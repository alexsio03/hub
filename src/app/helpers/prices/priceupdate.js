import axios from 'axios';
import RemoveBadItems from './removebaditems.js';
import NumberItems from './numitemsingame.js';

// Gets new prices from prices endpoint
// Removes the "bad items": non-marketables like coins and trophies
// Gets number of items in game after removing the non-marketables
export default async function PriceUpdate(){
  const url = 'https://prices.csgotrader.app/latest/prices_v6.json';

  try {
    const response = await axios.get(url);
    const data = response.data;
    await RemoveBadItems(data);
    console.log(`\nNumber of items in game: ${NumberItems()}\n`);
  } catch (err) {
    console.log(err);
  }
}
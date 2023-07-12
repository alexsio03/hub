import axios from 'axios';
import RemoveBadItems from './removebaditems';
import NumberSkins from './numskinsingame';

// Gets new prices from prices endpoint
// Removes the "bad items"
// Gets number of items in game
export default async function PriceUpdate(){
  const url = 'https://prices.csgotrader.app/latest/prices_v6.json';

  try {
    const response = await axios.get(url);
    const data = response.data;
    await RemoveBadItems(data);
    console.log(`\nNumber of items in game: ${NumberSkins()}\n`);
  } catch (err) {
    console.log(err);
  }
}
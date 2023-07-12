import axios from 'axios';
import RemoveBadItems from './removebaditems';
import NumberSkins from './numskinsingame';

// Gets new prices from prices endpoint
// Removes the "bad items"
// Gets number of items in game
export default async function PriceUpdate(){
    const url = 'prices.csgotrader.app/latest/prices_v6.json';
  
    await axios.get(url)
    .then(data=>{return data.json()})
    .catch(err=>console.log(err))
  }
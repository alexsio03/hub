import axios from 'axios';
import RemoveBadItems from './removebaditems.js';
import NumberItems from './numitemsingame.js';
import WriteNullObjects from './fillbaditems.js';

import fs from 'fs';
import { promisify } from 'util';
const readFileAsync = promisify(fs.readFile);

// Gets new prices from prices endpoint
// Removes the "bad items": non-marketables like coins and trophies
// Gets number of items in game after removing the non-marketables
export default async function PriceUpdate() {

  var lastUpdateTime = null;
  try {
    const data = await readFileAsync('./src/app/helpers/prices/lastupdate.txt', 'utf8');
    lastUpdateTime = parseInt(data.trim(), 10);
  } catch (error) {
    console.error('Error reading file:', error);
  }

  const currentTime = new Date().getTime();

  // If lastUpdateTime is not set or it's been 12 hours, update prices
  if (!lastUpdateTime || currentTime - lastUpdateTime >= 12 * 60 * 60 * 1000) {
    const url = 'https://prices.csgotrader.app/latest/prices_v6.json';

    try {
      const response = await axios.get(url);
      const data = response.data;
      await WriteNullObjects(data);
      await RemoveBadItems(data);
      console.log(`\nNumber of items in game: ${NumberItems()}\n`);

      // Update the lastUpdateTime
      fs.writeFile('./src/app/helpers/prices/lastupdate.txt', String(currentTime), (err) => {
          if (err) throw err;
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Not updating prices. It hasn't been 12 hours yet.");
  }
}
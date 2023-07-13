import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Edits prices json so that only valid items will
// remain as keys in the json
export default async function RemoveBadItems(priceData){
  try {
    const badItems = await GetBadItems();
  
    for await (const badItem of badItems) {
      delete priceData[badItem];
    }

    await WritePriceDataToJsonFile(priceData);
  } catch (err) {
    console.log(`\nhelpers/prices/removebaditems.js: ${err}\n`);
  }
}

// Fills array with each element being a line in baditems.txt
// These "bad items" are things like pickem trophies that can't be listed
async function GetBadItems(){
  try {
    const data = await readFileAsync('../TradingApp/src/app/helpers/prices/baditems.txt', 'utf8');
    const lines = data.split('\n');
    const nonEmptyLines = lines.map(line => line.trim()).filter(line => line !== '');
    return nonEmptyLines;
  } catch (err) {
    console.log(`\nhelpers/prices/removebaditems.js: ${err}\n`);
    return [];
  }
}

// Puts new, modified json into skinPrices.json
async function WritePriceDataToJsonFile(pricejson){
  try {
    const jsonData = JSON.stringify(pricejson, null, 2);
    await writeFileAsync('../TradingApp/src/app/helpers/prices/skinPrices.json', jsonData, 'utf8');
  } catch (err) {
    console.log(`\n\nhelpers/prices/removebaditems.js: ${err}\n`);
  }
}
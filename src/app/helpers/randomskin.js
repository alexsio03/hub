import data from './prices/skinPrices.json';
import IconRequest from './icons/iconrequest.js';
import GetIconFromJSON from './icons/checkiconjson.js';

// Gets random skin name using numskinsingame and uses IconRequest to get its icon
export default async function RandomSkin(){
  const numSkinsInGame = 21672; // Found using priceupdate.js
  const randomSkinNumber = Math.floor(Math.random()*numSkinsInGame);
  const allSkinNames = Object.keys(data);
  const randomSkinName = allSkinNames[randomSkinNumber];
  const randomSkinIcon = await IconRequest(randomSkinName);

  if (GetIconFromJSON(randomSkinName) == undefined){
    addSkinToList(randomSkinName, randomSkinIcon);
  }

  return {
    itemName: randomSkinName,
    itemIcon: randomSkinIcon
  }
}

// Prevents adding an empty icon, as bad links will always be 
// 67 characters long. They look like this:
/* https://community.cloudflare.steamstatic.com/economy/image//360fx360f */
// Will write name of any "bad item" without icon to a txt file
function addSkinToList(name, icon){
  const fs = require('fs');
  if (icon.length != 67){
    fs.readFile('../TradingApp/src/app/helpers/icons/skinIcons.json', 'utf8', (err, data) => {
      if (err) throw err;
      const removeEnd = data.substring(0, data.length-2);
      const newEnd =  ",\n\t\"" + name + "\": \"" + icon + "\"\n}";
      const newFileContents = removeEnd + newEnd;
      fs.writeFile('../TradingApp/src/app/helpers/icons/skinIcons.json', newFileContents, (err) => {
        if (err) throw err;
      });
    });
  } else {
    fs.writeFile('../TradingApp/src/app/helpers/prices/baditems.txt', name + "\n", {flag: "a"}, (err) => {
      if (err) throw err;
    });
  }
}
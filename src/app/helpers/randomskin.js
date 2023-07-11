import data from '../skin-info/skinPrices.json';
import IconRequest from './iconrequest.js';
import GetIconFromJSON from './checkiconjson.js';

// Gets random skin name using numskinsingame and uses IconRequest to get its icon
export default async function RandomSkin(){
  const randomSkinNumber = Math.floor(Math.random()*23743); // 23743 is found using numskinsingame.js
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

function addSkinToList(name, icon){
  if (icon.length != 67){
    const fs = require('fs');
    fs.readFile('../TradingApp/src/app/skin-info/skinIcons.json', 'utf8', (err, data) => {
      if (err) throw err;
      const removeEnd = data.substring(0, data.length-2);
      const newEnd =  ",\n\t\"" + name + "\": \"" + icon + "\"\n}";
      const newFileContents = removeEnd + newEnd;
      fs.writeFile('../TradingApp/src/app/skin-info/skinIcons.json', newFileContents, (err) => {
        if (err) throw err;
      });
    });
  }
}
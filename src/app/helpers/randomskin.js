import data from './prices/skinPrices.json';
import IconRequest from './icons/iconrequest.js';
import GetIconFromJSON from './icons/checkiconjson.js';

// Gets random skin name using numskinsingame and uses IconRequest to get its icon
export default async function RandomSkin(){
  const randomSkinNumber = Math.floor(Math.random()*22916); // 22916 is found using priceupdate.js
  const allSkinNames = Object.keys(data);
  const randomSkinName = allSkinNames[randomSkinNumber];
  const randomSkinIcon = await IconRequest(randomSkinName);

  return {
    itemName: randomSkinName,
    itemIcon: randomSkinIcon
  }
}

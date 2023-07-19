import data from './skindata.json';
import allSkins from './prices/skinPrices.json'
import SizeIcon from './icons/sizeicon';
import skins from '../helpers/error_jsons/skins.json'
import stickers from '../helpers/error_jsons/stickers.json'
import crates from '../helpers/error_jsons/crates.json'
import * as fuzzball from "fuzzball";

// Gets random skin name using numskinsingame and uses IconRequest to get its icon
export default async function RandomSkin(){
  const numSkinsInGame = 21672; // Found using priceupdate.js
  const randomSkinNumber = Math.floor(Math.random()*numSkinsInGame);
  const allSkinNames = Object.keys(allSkins);
  const skinData = Object.entries(data.items_list)
  const randomSkinPrices = allSkinNames[randomSkinNumber];
  const randomSkin = skinData.find((item) => item[0] == randomSkinPrices)
  var randomSkinName;
  var randomSkinIcon;
  if(randomSkin) {
    randomSkinName = randomSkin[0]
    randomSkinIcon = `https://community.cloudflare.steamstatic.com/economy/image/${SizeIcon(randomSkin[1])}/330x192`
  } else {
    randomSkinName = randomSkinPrices
    console.log(randomSkinName)
    randomSkinIcon = findImageByItemName(randomSkinName, [crates, stickers, skins]);
    console.log(randomSkinIcon)
  }

  return {
    itemName: randomSkinName,
    itemIcon: randomSkinIcon
  }
}

function findImageByItemName(itemName, arrays) {
  const sanitizedItemName = itemName
    .replace(/★/g, "")
    .replace(/StatTrak™/g, "")
    .replace(/\(.+?\)/g, "")
    .trim();

  for (const array of arrays) {
    const item = array.find((item) => {
      const sanitizedArrayItemName = item.name
        .replace(/★/g, "")
        .replace(/StatTrak™/g, "")
        .replace(/\(.+?\)/g, "")
        .trim();

      const partialRatio = fuzzball.partial_ratio(
        sanitizedItemName,
        sanitizedArrayItemName
      );

      return partialRatio >= 95; // Adjust the threshold as needed
    });

    if (item) {
      return item.image;
    }
  }

  return null; // Return null if no matching item is found
}
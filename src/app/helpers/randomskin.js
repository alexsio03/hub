import data from './skindata.json';
import allSkins from './prices/skinPrices.json'
import SizeIcon from './icons/sizeicon';
import findImage from '../helpers/findImage'

// Gets random skin name using numskinsingame and uses IconRequest to get its icon
export default async function RandomSkin(){
  const numSkinsInGame = 21655; // Found using priceupdate.js
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
    randomSkinIcon = findImage(randomSkinName);
    console.log(randomSkinIcon)
  }

  return {
    itemName: randomSkinName,
    itemIcon: randomSkinIcon
  }
}
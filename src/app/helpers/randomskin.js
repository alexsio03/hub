import data from '../skin-info/skinPrices.json';
import IconRequest from './iconrequest.js/index.js';

// Gets random skin name using numskinsingame and uses IconRequest to get its icon
export default async function RandomSkin(){
    const randomSkinNumber = Math.floor(Math.random()*23743); // 23743 is found using numskinsingame.js
    const allSkinNames = Object.keys(data);
    const randomSkinName = allSkinNames[randomSkinNumber];
    const randomSkinIcon = await IconRequest(randomSkinName);

    return {
        itemName: randomSkinName,
        itemIcon: randomSkinIcon
    }
}
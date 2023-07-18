import iconJSON from '../skindata.json';
import SizeIcon from './sizeicon.js'

// Searches JSON in skinIcons.json
// Returns the icon if it's already stored, otherwise returns undefined
export default function GetIconFromJSON(skinName) {
  const itemJSON = iconJSON.items_list[EncodeSkinName(skinName)];
  try{
    return `https://community.cloudflare.steamstatic.com/economy/image/${itemJSON['icon_url']}/330x192`;
  } catch {
    console.log(EncodeSkinName(skinName));
  }
}

// Knife star is encoded as \u2605
// Single quote is encoded as &#39
// The small "TM" that comes after StatTrak is \u2122
function EncodeSkinName(skin){
  return skin.replace(/★/g, '\\u2605').replace(/'/g, '&#39;').replace(/™/g, '\\u2122');
}
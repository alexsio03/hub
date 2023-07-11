import iconJSON from '../skin-info/skinIcons.json';

// Searches JSON from skinIcons.json in skin-info if icon already stored, otherwise returns undefined
export default function GetIconFromJSON(skinName){
  for (let skin in iconJSON){
    if (skinName == skin) return iconJSON[skin];
  }
  return undefined;
}
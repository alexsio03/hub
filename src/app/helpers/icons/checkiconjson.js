import iconJSON from './skinIcons.json';

// Searches JSON from skinIcons.json if icon already stored, otherwise returns undefined
export default function GetIconFromJSON(skinName){
  for (let skin in iconJSON){
    if (skinName == skin) return iconJSON[skin];
  }
  return undefined;
}
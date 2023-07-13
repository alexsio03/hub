import iconJSON from './skinIcons.json';

// Searches JSON in skinIcons.json
// Returns the icon if it's already stored, otherwise returns undefined
export default function GetIconFromJSON(skinName) {
  return iconJSON[skinName];
}
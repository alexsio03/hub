import iconJSON from '../skindata.json';

// Searches JSON in skinIcons.json
// Returns the icon if it's already stored, otherwise returns undefined
export default function GetIconFromJSON(skinName) {
  const itemJSON = iconJSON.items_list[skinName];
  try{
    return `https://community.cloudflare.steamstatic.com/economy/image/${itemJSON['icon_url']}/330x192`;
  } catch (err) {
    console.log("ERROR SEARCHING: " + skinName);
    //console.log(err);
  }
}
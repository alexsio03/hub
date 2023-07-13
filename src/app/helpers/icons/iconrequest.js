import axios from 'axios';
import GetIconFromJSON from './checkiconjson.js';

// Finds icon of a skin when given the name
export default async function IconRequest(skinName){
  // Use cached icon if already stored
  const cachedIcon = GetIconFromJSON(skinName);
  if (cachedIcon) {
    return cachedIcon;
  }

  // If icon not already stored, generate link to go to its market page
  const encodedSkinName = encodeURIComponent(skinName);
  const url = `https://steamcommunity.com/market/listings/730/${ExtraEncode(encodedSkinName)}`;

  // Will be set to the full url where the item icon is stored
  var fullURL;

  // Get full HTML from item market page
  await axios.get(url)
  .then((getResponse) => {
    let data = getResponse.data;

    // Locate the item's image link by parsing the html
    let startPos = data.indexOf('https://community.cloudflare.steamstatic.com/economy/image/');
    let endPos = data.indexOf('>', startPos);

    // Example link: https://community.cloudflare.steamstatic.com/economy/image/-9a81(...)/360fx360f>
    // endPos-1 takes off the >
    // endPos-10 takes off the sizing so that it can be changed to 330x192
    const skinIconURL = data.substring(startPos, endPos-10);
    fullURL = `${skinIconURL}330x192`;

    // Uncomment this to print full html response(s)
    // const fs = require('fs');
    // fs.writeFile('src/app/helpers/htmlresponse.txt', data + "\n\n\n", {flag: 'a+'}, (err) => {
    //   if (err) throw err;
    // });
  })
  .catch(err=>console.log("\n\nERROR iconrequest.js: " + err + "\n\n"))

  return fullURL;
}

// Extra character encoding to comply with steam url convention
function ExtraEncode(str){
  return str.replace(/[()']/g, (match) => `%${match.charCodeAt(0).toString(16)}`);
}
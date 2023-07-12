import axios from 'axios';
import GetIconFromJSON from './checkiconjson.js';

var fullURL;

// Finds icon of a skin when given the name
export default async function IconRequest(skinName){
  const cachedIcon = GetIconFromJSON(skinName);
  if (cachedIcon != undefined) {
    return cachedIcon;
  }

  const encodedSkinName = encodeURIComponent(skinName);
  const url = `https://steamcommunity.com/market/listings/730/${ExtraEncode(encodedSkinName)}`;

  // Write url to file, helps with debugging
  // const fs = require('fs');
  // fs.writeFile('src/app/helpers/urls.txt', "\n" + url + "\n", {flag: 'a+'}, (err) => {
  //   if (err) throw err;
  // });

  await axios.get(url)
  .then((getResponse) => {
    let data = getResponse.data;
    let startPos = data.indexOf('https://community.cloudflare.steamstatic.com/economy/image/');
    let endPos = data.indexOf('>', startPos);

    // Example: https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2U . . . /360fx360f>
    // endPos-1 takes off the >
    // endPos-10 takes off the sizing so that it can be changed to 330x192
    const skinIconURL = data.substring(startPos, endPos-10);
    fullURL = skinIconURL + "330x192";

    // Uncomment this to print full html response(s) to FULLHTML.txt
    // const fs = require('fs');
    // fs.writeFile('src/app/helpers/FULLHTML.txt', data + "\n\n\n", {flag: 'a+'}, (err) => {
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
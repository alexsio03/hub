import axios from 'axios';
import GetIconFromJSON from './checkiconjson.js';

var fullURL;

// Finds icon of a skin when given the name
export default async function IconRequest(skinName){
  if (GetIconFromJSON(skinName) != undefined){
    const fd = require('fs');
    fd.writeFile('src/app/helpers/HAPPEN.txt', "DUPLICATE WAS CAUGHT", {flag: 'a+'}, (err) => {
      if (err) throw err;
    });

    return GetIconFromJSON(skinName);
  }

  const url1 = 'https://steamcommunity.com/market/listings/730/'
  const urlData = ExtraEncode(encodeURIComponent(skinName));
  const url = url1 + urlData;

  const fs = require('fs');
  fs.writeFile('src/app/helpers/FULLHTML.txt', "\n" + url + "\n\n", {flag: 'a+'}, (err) => {
    if (err) throw err;
  });

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
  const opening = str.replace("(", "%28");
  const closing = opening.replace(")", "%29");
  const apost = closing.replace("\'", "%27")
  const revert = apost.replace("%2F", "-");
  return revert;
}
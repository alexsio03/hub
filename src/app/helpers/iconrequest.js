import axios from 'axios';

var fullURL;

// Finds icon of a skin when given the name
export default async function IconRequest(skinName){
    const url1 = 'https://steamcommunity.com/market/listings/730/'
    const urlData = EncodeParentheses(encodeURIComponent(skinName));
    const url = url1 + urlData;

    await axios.get(url)
    .then((getResponse) => {
      let data = getResponse.data;
      let startPos = data.search('https://community.cloudflare.steamstatic.com/economy/image/-9');
      let endPos = data.indexOf('>', startPos);

      // Example: https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2U . . . /360fx360f>
      // endPos-1 takes off the >
      // endPos-10 takes off the sizing so that it can be changed to 330x192
      const skinIconURL = data.substring(startPos, endPos-10);
      fullURL = skinIconURL + "330x192";
    })
    .catch(err=>console.log("\n\nERROR steamrequest.js: " + err + "\n\n"))

    return fullURL;
}

// Changes parentheses to comply with steam url convention
function EncodeParentheses(str){
  const opening = str.replace("(", "%28");
  const closing = opening.replace(")", "%29");
  return closing;
}
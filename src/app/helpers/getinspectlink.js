// Gets inspect link for a given item
export default function GenerateInspectLink(jsondata, itemName, steamid){
  let invItem;
  for (const item in jsondata.descriptions){
    if (jsondata.descriptions[item].market_name == itemName){
      invItem = jsondata.descriptions[item];
    }
  }

  if(invItem.actions) {
    var link = JSON.stringify(invItem.actions[0].link);
    var assetid = jsondata.assets.find((asset) => asset.classid == invItem.classid).assetid;
    link = link.replace("%owner_steamid%", steamid).replace("%assetid%", assetid)
    return link;
  }
  return null;
}

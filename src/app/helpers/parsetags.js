
export default function ParseTags(jsondata, itemName, category){
  let invItem;
  for (const item in jsondata.descriptions){
    if (jsondata.descriptions[item].market_name == itemName){
      invItem = jsondata.descriptions[item];
    }
  }

  if (category == "Souvenir"){
    var tagNumber = 0;
    for (const tag in invItem.tags){
      if (invItem.tags[tag].category == "Quality"){
        return (invItem.tags[tag].localized_tag_name == "Souvenir") ? 1 : 0;
      }
      tagNumber++;
    }
    return undefined;
  }

  if (category == "StatTrak"){
    var tagNumber = 0;
    for (const tag in invItem.tags){
      if (invItem.tags[tag].category == "Quality"){
        return (invItem.tags[tag].localized_tag_name == "StatTrak™") ? 1 : 0;
      }
      tagNumber++;
    }
    return undefined;
  }

  if (category == "Color"){
    var tagNumber = 0;
    for (const tag in invItem.tags){
      if (invItem.tags[tag].category == "Rarity"){
        return invItem.tags[tag].color;
      }
      tagNumber++;
    }
    return undefined;
  }

  var tagNumber = 0;
  for (const tag in invItem.tags){
    if (invItem.tags[tag].category == category){
      return invItem.tags[tag].localized_tag_name;
    }
    tagNumber++;
  }
  return undefined;
}
import skins from '../helpers/error_jsons/skins.json'
import stickers from '../helpers/error_jsons/stickers.json'
import crates from '../helpers/error_jsons/crates.json'
import agents from '../helpers/error_jsons/agents.json'
import music from '../helpers/error_jsons/music_kits.json'
import graffiti from '../helpers/error_jsons/graffiti.json'
import * as fuzzball from "fuzzball";

export default function findItem(itemName) {
  const arrays = [skins, stickers, crates, agents, music, graffiti]
  const sanitizedItemName = itemName
    .replace(/★/g, "")
    .replace(/Sealed Graffiti/g, "")
    .replace(/StatTrak™/g, "")
    .replace(/\(.+?\)/g, "")
    .trim();

  for (const array of arrays) {
    const item = array.find((item) => {
      const sanitizedArrayItemName = item.name
        .replace(/★/g, "")
        .replace(/StatTrak™/g, "")
        .replace(/\(.+?\)/g, "")
        .trim();

      const partialRatio = fuzzball.partial_ratio(
        sanitizedItemName,
        sanitizedArrayItemName
      );

      return partialRatio >= 98; // Adjust the threshold as needed
    });

    if (item) {
      return item;
    }
  }

  return null; // Return null if no matching item is found
}
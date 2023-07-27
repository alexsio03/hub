// Import necessary JSON data and the 'fuzzball' library for string matching.
import skins from '../helpers/error_jsons/skins.json';
import stickers from '../helpers/error_jsons/stickers.json';
import crates from '../helpers/error_jsons/crates.json';
import agents from '../helpers/error_jsons/agents.json';
import music from '../helpers/error_jsons/music_kits.json';
import graffiti from '../helpers/error_jsons/graffiti.json';
import * as fuzzball from "fuzzball";

// Define the function 'findItem' that takes an 'itemName' as input.
export default function findItem(itemName) {
  // Create an array of JSON data containing various item types.
  const arrays = [skins, stickers, crates, agents, music, graffiti];

  // Sanitize the 'itemName' to remove certain strings and trim whitespace.
  const sanitizedItemName = itemName
    .replace(/★/g, "")
    .replace(/Sealed Graffiti/g, "")
    .replace(/StatTrak™/g, "")
    .replace(/\(.+?\)/g, "")
    .trim();

  // Loop through each array of items to find a match with the 'itemName'.
  for (const array of arrays) {
    // Find an item in the array with a similar name using fuzzy string matching.
    const item = array.find((item) => {
      // Sanitize the array item's name for comparison.
      const sanitizedArrayItemName = item.name
        .replace(/★/g, "")
        .replace(/StatTrak™/g, "")
        .replace(/\(.+?\)/g, "")
        .trim();

      // Use the 'fuzzball.partial_ratio' function to compare strings.
      const partialRatio = fuzzball.partial_ratio(
        sanitizedItemName,
        sanitizedArrayItemName
      );

      // Return true if the similarity ratio is above or equal to 98 (adjustable threshold).
      return partialRatio >= 98; // Adjust the threshold as needed
    });

    // If a matching item is found, return it.
    if (item) {
      return item;
    }
  }

  // If no matching item is found, return null.
  return null;
}

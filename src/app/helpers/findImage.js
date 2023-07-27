// Importing necessary JSON data and the 'fuzzball' library for string similarity comparison
import skins from '../helpers/error_jsons/skins.json'; // JSON data for skins
import stickers from '../helpers/error_jsons/stickers.json'; // JSON data for stickers
import crates from '../helpers/error_jsons/crates.json'; // JSON data for crates
import agents from '../helpers/error_jsons/agents.json'; // JSON data for agents
import music from '../helpers/error_jsons/music_kits.json'; // JSON data for music kits
import * as fuzzball from "fuzzball"; // Importing 'fuzzball' library for string similarity

// Function to find the item image URL based on the given item name
export default function findImage(itemName) {
  // An array containing JSON data for different categories (skins, stickers, crates, agents, music kits)
  const arrays = [skins, stickers, crates, agents, music];

  // Sanitize the item name by removing unwanted characters and trimming whitespace
  const sanitizedItemName = itemName
    .replace(/★/g, "") // Remove '★' character
    .replace(/StatTrak™/g, "") // Remove 'StatTrak™' from the name
    .replace(/\(.+?\)/g, "") // Remove text within parentheses (e.g., '(Field-Tested)')
    .trim(); // Trim leading and trailing whitespace

  // Loop through each array to find a matching item based on string similarity
  for (const array of arrays) {
    // Find an item in the array with a name that closely matches the sanitized item name
    const item = array.find((item) => {
      // Sanitize the array item name for comparison
      const sanitizedArrayItemName = item.name
        .replace(/★/g, "") // Remove '★' character
        .replace(/StatTrak™/g, "") // Remove 'StatTrak™' from the name
        .replace(/\(.+?\)/g, "") // Remove text within parentheses (e.g., '(Field-Tested)')
        .trim(); // Trim leading and trailing whitespace

      // Calculate the partial ratio between the sanitized item name and the sanitized array item name
      // Fuzzy string matching is used to handle minor differences and misspellings in the names
      const partialRatio = fuzzball.partial_ratio(
        sanitizedItemName,
        sanitizedArrayItemName
      );

      // Return 'true' if the partial ratio is greater than or equal to 95 (adjust the threshold as needed)
      return partialRatio >= 95;
    });

    // If a matching item is found, return its image URL
    if (item) {
      return item.image;
    }
  }

  // If no matching item is found in any category, return 'null'
  return null;
}

import axios from 'axios';

// Loads steam inventory
export default function LoadInventory(steamid) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:3000/steam-proxy/${steamid}`)
      .then(response => {
        const data = response.data;
        resolve(data);
      })
      .catch(error => {
        if (error.response && error.response.status === 500) {
          console.log('Error: Rate limit exceeded. Status code 500.');
          resolve(null);
        } else {
          console.error("\n\nERROR IN LoadInventory:", error);
        }
        reject(error);
      });
  });
}
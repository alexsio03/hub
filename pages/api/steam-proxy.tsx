// pages/api/inventory/[steamid].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type ResponseData = {
  message?: string; // Make message optional
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { steamID } = req.query; // Access the captured parameter

    if (!steamID) {
      return res.status(400).json({ error: 'Missing steamid parameter' });
    }

    const url1 = `http://steamcommunity.com/inventory/${steamID}/730/2`;
    const url2 = '?l=english&count=2000';
    const url = url1 + url2; // Add the trailing slash before the query parameters

    // Fetch the Steam inventory data
    console.log(url)
    const response = await axios.get(url);
    console.log("Response: " + response.data)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

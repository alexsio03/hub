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
    const { steamid } = req.query; // Access the captured parameter

    if (!steamid) {
      return res.status(400).json({ error: 'Missing steamid parameter' });
    }

    const url1 = `http://steamcommunity.com/inventory/${steamid}/730/2`;
    const url2 = '?l=english&count=2000';
    const url = url1 + url2; // Add the trailing slash before the query parameters

    // Fetch the Steam inventory data
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

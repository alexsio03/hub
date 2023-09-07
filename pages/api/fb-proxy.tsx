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
    const { downloadURL } = req.query;

    if (!downloadURL) {
      return res.status(400).json({ error: 'Missing downloadURL parameter' });
    }

    // Fetch the JSON file using the download URL
    const response = await axios.get(downloadURL.toString());

    // Set the appropriate headers for the response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="downloaded.json"');

    // Pass back the JSON file
    res.send(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

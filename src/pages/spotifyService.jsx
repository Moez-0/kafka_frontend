// spotifyService.js

import axios from 'axios';

// Fetch Spotify access token
export const getAccessToken = async () => {
  const CLIENT_ID = 'fde9f998de9d4de0a547698d8bed7a2d';
  const CLIENT_SECRET = 'e96f8fbe41574c08b6475ded36e44ace';
  
  // Use btoa to encode the client ID and client secret in base64
  const encoded = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  return response.data.access_token;
};

// Search for a song
export const searchSong = async (query) => {
  const accessToken = await getAccessToken();

  const response = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    params: {
      q: query,
      type: 'track',
      limit: 5, // Limit results to 5 songs
    },
  });
  
  return response.data;
};

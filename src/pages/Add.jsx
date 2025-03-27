import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchSong } from './spotifyService'; // Import searchSong from spotifyService
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { toast } from 'react-toastify'; // Import toast for notifications

const Add = () => {
  const { user } = useAuth(); // Use the useAuth hook to get the user details
  const navigate = useNavigate(); // Hook for navigation
  const [caption, setCaption] = useState('');
  const [songUri, setSongUri] = useState(''); // This will store the embed link
  const [songLink, setSongLink] = useState('');
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [songResults, setSongResults] = useState([]);

  const handleSongSearch = async (e) => {
    e.preventDefault();
    if (songSearchQuery) {
      try {
        const data = await searchSong(songSearchQuery); // Use searchSong from spotifyService
        setSongResults(data.tracks.items); // Set the results to display in the UI
      } catch (err) {
        console.error('Error fetching song data:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !songUri) {
      console.log("Caption or song is missing");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, user is not authenticated");
      return;
    }

    try {
      console.log("creating post for user", user.userId);
      const postData = {
        userId: user.userId,
        caption,
        songUri,
        songLink,
      };

      await axios.post("http://localhost:5000/api/posts", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post added successfully!");
      navigate("/explore");
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);

      if (error.response?.status === 400) {
        toast.error("You can only post once per day.");
      } else {
        toast.error("Error creating post. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl mb-6 sm:mb-8 text-center font-goldman">Share Your Feelings</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-secondary p-6 sm:p-8 rounded-2xl shadow-lg">
        <div className="mb-4">
          <label htmlFor="caption" className="block text-sm sm:text-base mb-2">Your Feeling</label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share your thoughts..."
            rows="4"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Song Search Section */}
        <div className="mb-4">
          <label htmlFor="songSearch" className="block text-sm sm:text-base mb-2">Search for a Song</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              id="songSearch"
              value={songSearchQuery}
              onChange={(e) => setSongSearchQuery(e.target.value)}
              placeholder="Search for a song..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleSongSearch}
              className="bg-primary text-black py-2 px-4 rounded-lg hover:opacity-80 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Search Results */}
        {songResults.length > 0 && (
          <div className="mb-4">
            <p className="text-sm sm:text-base mb-2">Search Results:</p>
            <ul className="space-y-4">
              {songResults.map((song) => (
                <li key={song.id} className="flex items-center space-x-3 bg-background p-4 rounded-lg shadow-lg hover:bg-gray-700">
                  <img
                    src={song.album.images[0]?.url}
                    alt={song.name}
                    className="h-16 w-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm sm:text-base">{song.name}</p>
                    <p className="text-xs text-gray-500">{song.artists[0].name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const trackId = song.uri.split(":")[2]; // Extract track ID
                      setSongUri(`https://open.spotify.com/embed/track/${trackId}`); // Set the embed link
                      setSongLink(song.external_urls.spotify); // Set the external Spotify link
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Select this song
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Song Embed and Link */}
        {songUri && (
          <div className="mb-4">
            <div className="bg-background p-4 rounded-lg shadow-lg">
              <iframe
                src={songUri}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                title="Selected Song"
              ></iframe>
              <a href={songLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm sm:text-base mt-2 inline-block">
                Listen on Spotify
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-primary text-black py-2 px-6 rounded-lg hover:opacity-80 transition text-sm sm:text-base"
          >
            Post Your Song
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/explore"
          className="text-primary hover:underline text-sm sm:text-base"
        >
          Go back to Explore
        </Link>
      </div>
    </div>
  );
};

export default Add;

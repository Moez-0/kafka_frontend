import React, { useState, useEffect } from "react";
import { FaCompactDisc } from "react-icons/fa6";

const LofiPlayer = () => {
  const [playing, setPlaying] = useState(true); // Autoplay enabled
  const youtubeUrl =
    "https://www.youtube.com/embed/-R0UYHS8A_A?autoplay=1&loop=1&playlist=-R0UYHS8A_A&mute=1"; // Muted autoplay

  useEffect(() => {
    // Small delay to ensure autoplay
    const timer = setTimeout(() => {
      setPlaying(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Button to toggle lofi beats */}
      <button
        onClick={() => setPlaying(!playing)}
        className="cursor-pointer hover:text-pink-300 transition"
      >
        <FaCompactDisc className={`h-8 w-8 ${playing ? "animate-spin" : ""}`} />
      </button>

      {/* Hidden iframe that plays only the sound */}
      {playing && (
        <iframe
          src={youtubeUrl}
          allow="autoplay"
          className="hidden" // Hide the iframe visually
          title="Lofi Music"
        />
      )}
    </div>
  );
};

export default LofiPlayer;

import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6">
        <Link to="/" className="logo">
          <img src="logo_light.svg" alt="Kafka" className="h-16 w-16 sm:h-20 sm:w-20" />
        </Link>

        <h1 className="text-5xl mb-4 font-goldman">
          Welcome to Kafka
        </h1>

        <p className="text-xl max-w-3xl mx-auto text-primary">
          Made by Moez for friends
          Kafka is a place where each day you can choose one song from Spotify and reflect on how life feels that day.
        </p>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          Share your thoughts, connect with others, and explore the feelings of others through music and words.
        </p>

        <div className="space-x-6">
  <Link to="/signup" className="bg-primary text-black py-1 px-2 rounded-lg hover:opacity-80 transition md:py-2 md:px-6">Join Now</Link>
  <Link to="/explore" className="text-lg text-gray-400 hover:text-white transition text-xs md:text-sm">Todays Feelings </Link>
</div>
      </main>

    </div>
  );
};

export default Homepage;

import React from "react";

const MovieSuggestion = () => {
  // Hardcoded movie data for "Naked" (1993)
  const movie = {
    title: "Naked",
    year: "1993",
    poster: "https://m.media-amazon.com/images/M/MV5BMTY0OTcwNDI0MV5BMl5BanBnXkFtZTcwOTc1MDEzMQ@@._V1_.jpg", // Example poster image
    imdbID: "tt0107653", // IMDb ID for the movie
  };

  return (
    <div className="flex justify-center items-center min-h-screen  py-6">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-xs w-full text-center transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {movie.title} ({movie.year})
        </h2>
        <img
          className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
          src={movie.poster}
          alt={movie.title}
        />
        <a
          className="text-primary text-lg font-semibold hover:text-blue-700"
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on IMDb
        </a>
      </div>
    </div>
  );
};

export default MovieSuggestion;

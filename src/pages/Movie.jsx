import React from "react";

const MovieSuggestion = () => {
  // Hardcoded movie data for "Naked" (1997)
  const movie = {
    title: "Naked",
    year: "1993",
    poster: "https://m.media-amazon.com/images/M/MV5BMTY0OTcwNDI0MV5BMl5BanBnXkFtZTcwOTc1MDEzMQ@@._V1_.jpg", // Example poster image
    imdbID: "tt0107653", // IMDb ID for the movie
  };

  return (
    <div className="movie-suggestion">
      <h2>{movie.title} ({movie.year})</h2>
      <img src={movie.poster} alt={movie.title} />
      <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noopener noreferrer">
        View on IMDb
      </a>
    </div>
  );
};

export default MovieSuggestion;

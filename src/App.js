import React, { useCallback, useEffect, useState } from "react";
import AddMovie from "./components/AddMovie";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-http-36f62-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("something went wrong!!");
      }

      const data = await response.json();

      console.log(data);

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);

      // use .catch() for error if we don't use async await method .. i.e we are using
      // .then((response)=>{
      //  return response.json()
      // }).then((data)=>{
      //   setMovies(data.results).catch()
      // }

      // const transformedMovie = data.results.map( movieData => {
      //   return {
      //     id : movieData.episode_id,
      //     title:movieData.title,
      //     openingText :movieData.opening_crawl,
      //     releaseData: movieData.release_date

      //   }
      // })
      // setMovies(transformedMovie)
      //or simply change the property

      // setMovies(data.results);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  const onAddMovieHandler = async (movie) => {
    const response = await fetch(
      "https://react-http-36f62-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={onAddMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length == 0 && !error && <p>no movies found</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;

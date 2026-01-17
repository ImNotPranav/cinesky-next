import MovieCard from "../components/MovieCard";
import { getPopularMovies } from '../api/getMovies';
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function Home() {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [noResults, setNoResults] = useState(false)

  useEffect(() => {
    async function loadMovies() {
      const data = await getPopularMovies()
      setPopularMovies(data.results)
    }
    loadMovies();
  }, [])

  const handleSearchResults = (results, hasSearched) => {
    setMovies(results)
    setNoResults(hasSearched && results.length === 0)
  }

  let MovieData
  if (movies.length !== 0)
    MovieData = movies.map((movie) =>
      <Link to={`/moviedetails/${movie.id}`} key={movie.id}>
        <MovieCard movie={movie} />
      </Link>
    )
  else
    MovieData = popularMovies.map((movie) =>
      <Link to={`/moviedetails/${movie.id}`} key={movie.id}>
        <MovieCard movie={movie} />
      </Link>
    )

  return (
    <>
      <Navbar />
      <SearchBar onSearchResults={handleSearchResults} />
      <div className="p-7 flex flex-wrap gap-7 bg-[#1A1A1A] min-h-screen items-start">
        {noResults ? (
          <div className="w-full flex flex-col items-center justify-center py-20">
            <svg className="w-20 h-20 text-white/30 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-white/50 text-xl font-medium">No results found</h2>
            <p className="text-white/30 mt-2">Try searching for something else</p>
          </div>
        ) : (
          MovieData
        )}
      </div>
    </>
  );
}

export default Home;
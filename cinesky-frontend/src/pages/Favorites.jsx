import React from 'react'
import MovieCard from '../components/MovieCard'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'

const Favorites = () => {
    const { favoriteMovies } = useFavorites()

    if (!favoriteMovies.length) {
        return (
            <>
                <Navbar />
                <div className="p-7 flex flex-wrap gap-7 bg-[#1A1A1A] min-h-screen items-start">
                    <h1 className="text-2xl font-bold text-white">No favorite movies found</h1>
                </div>
            </>
        )
    }
    return (
        <>
            <Navbar />
            <div className="p-7 flex flex-wrap gap-7 bg-[#1A1A1A] min-h-screen items-start">
                {favoriteMovies.map((movie) => (
                    <Link to={`/moviedetails/${movie.id}`} key={movie.id}>
                        <MovieCard movie={movie} />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Favorites
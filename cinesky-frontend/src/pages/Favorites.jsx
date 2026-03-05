import React, { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import { useAuth } from '../contexts/AuthContext'
import { getRecommendations } from '../api/recommendations'

const Favorites = () => {
    const { favoriteMovies } = useFavorites()
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState([])
    const [recsLoading, setRecsLoading] = useState(false)

    useEffect(() => {
        async function loadRecommendations() {
            if (user && favoriteMovies.length > 0) {
                setRecsLoading(true)
                try {
                    const recs = await getRecommendations()
                    if (recs) setRecommendations(recs)
                } catch (err) {
                    console.error("Failed to load recommendations:", err)
                } finally {
                    setRecsLoading(false)
                }
            }
        }
        loadRecommendations()
    }, [user, favoriteMovies])

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
            <div className="bg-[#1A1A1A] min-h-screen">
                {/* Favorites Section */}
                <div className="p-7">
                    <h1 className="text-2xl font-bold text-white mb-5">
                        Your Favorites
                    </h1>
                    <div className="flex flex-wrap gap-7 items-start">
                        {favoriteMovies.map((movie) => (
                            <Link to={`/moviedetails/${movie.id}`} key={movie.id}>
                                <MovieCard movie={movie} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recommended for You Section */}
                {user && (
                    <div className="p-7 pt-2">
                        <div className="border-t border-white/10 pt-7">
                            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    Recommended for You
                                </span>
                            </h2>
                            <p className="text-zinc-500 text-sm mb-5">
                                Based on your favorite movies
                            </p>

                            {recsLoading ? (
                                <div className="flex flex-wrap gap-7 items-start">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="my-2 mx-2 w-full sm:w-[40%] md:w-[200px] bg-[#202020] rounded-xl overflow-hidden border border-white/10 animate-pulse"
                                        >
                                            <div className="aspect-[2/3] bg-[#2a2a2a]" />
                                            <div className="p-3">
                                                <div className="h-4 bg-[#2a2a2a] rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recommendations.length > 0 ? (
                                <div className="flex flex-wrap gap-7 items-start">
                                    {recommendations.map((movie) => (
                                        <Link to={`/moviedetails/${movie.id}`} key={movie.id}>
                                            <MovieCard movie={movie} />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500 text-sm">
                                    No recommendations available. Add more favorites to get personalized suggestions!
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Favorites
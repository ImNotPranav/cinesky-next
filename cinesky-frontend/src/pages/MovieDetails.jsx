import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiHeart, FiClock, FiCalendar, FiStar } from 'react-icons/fi'
import { FaHeart, FaPlay } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import { getMovieDetails, getBackdropUrl, getPosterUrl, getProfileUrl } from '../api/getMovies'
import Navbar from '../components/Navbar'
import { useFavorites } from '../contexts/FavoritesContext'
import Reviews from '../components/Reviews'

const MovieDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { addFavorite, removeFavorite, isFavorite } = useFavorites()
    const [movie, setMovie] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toast, setToast] = useState({ show: false, message: '', type: '' })

    const isLiked = isFavorite(Number(id))

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const movie = await getMovieDetails(id)
                setMovie(movie)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchMovieDetails()
    }, [id])

    const showToast = (message, type) => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 2500)
    }

    const changeLikedState = () => {
        if (isLiked) {
            removeFavorite(movie.id)
            showToast('Removed from Favorites', 'removed')
        } else {
            addFavorite(movie)
            showToast('Added to Favorites', 'added')
        }
    }

    const formatRuntime = (minutes) => {
        if (!minutes) return null
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}m`
    }

    const formatMoney = (amount) => {
        if (!amount) return null
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getRatingColor = (rating) => {
        if (rating >= 7) return 'text-green-400'
        if (rating >= 5) return 'text-yellow-400'
        return 'text-red-400'
    }

    if (loading) {
        return (
            <div className="bg-[#1A1A1A] flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-[#C43A3A] animate-spin" />
                    <p className="text-gray-400 text-sm">Loading movie details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-[#1A1A1A] flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-white text-xl mb-2">Oops! Something went wrong</div>
                    <div className="text-gray-400">{error.message}</div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-6 py-2 bg-[#C43A3A] text-white rounded-lg hover:bg-[#a83232] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    const cast = movie.credits?.cast?.slice(0, 10) || []
    const director = movie.credits?.crew?.find(person => person.job === 'Director')
    const releaseYear = movie.release_date?.split('-')[0]

    return (
        <div className='bg-[#1A1A1A] min-h-screen'>
            <Navbar />

            {/* Toast Notification */}
            <div
                className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${toast.show
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
            >
                <div className={`px-5 py-3 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-2 ${toast.type === 'added'
                    ? 'bg-pink-500/90 text-white'
                    : 'bg-gray-700/90 text-gray-100'
                    }`}>
                    {toast.type === 'added' ? (
                        <FaHeart className="text-white" />
                    ) : (
                        <FiHeart className="text-gray-100" />
                    )}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            </div>

            {/* Hero Section with Backdrop */}
            <div className="relative w-full h-[70vh] overflow-hidden">
                {/* Back Button */}
                <button
                    className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <IoArrowBack className="text-xl text-white" />
                </button>

                {/* Backdrop Image */}
                {movie.backdrop_path ? (
                    <img
                        src={getBackdropUrl(movie.backdrop_path)}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#151515] flex items-center justify-center">
                        <div className="text-center opacity-30">
                            <span className="text-8xl">🎬</span>
                        </div>
                    </div>
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-end md:items-end">

                        {/* Poster */}
                        <div className="hidden md:block flex-shrink-0 w-48 lg:w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 transform translate-y-16">
                            {movie.poster_path ? (
                                <img
                                    src={getPosterUrl(movie.poster_path)}
                                    alt={movie.title}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#151515] flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl opacity-30">🎬</span>
                                        <p className="text-gray-500 text-sm mt-2">No Poster</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1 pb-4">
                            {/* Title & Adult Badge */}
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {movie.title}
                                </h1>
                                {movie.adult && (
                                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        18+
                                    </span>
                                )}
                            </div>

                            {/* Tagline */}
                            {movie.tagline && (
                                <p className="text-gray-300 italic text-lg mb-4">"{movie.tagline}"</p>
                            )}

                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-5">
                                {/* Rating */}
                                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                                    <FiStar className={`${getRatingColor(movie.vote_average)}`} />
                                    <span className={`font-semibold ${getRatingColor(movie.vote_average)}`}>
                                        {movie.vote_average?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-500">/ 10</span>
                                    <span className="text-gray-500 text-xs">({movie.vote_count?.toLocaleString()} votes)</span>
                                </div>

                                {/* Release Year */}
                                {releaseYear && (
                                    <div className="flex items-center gap-1.5">
                                        <FiCalendar className="text-gray-400" />
                                        <span>{releaseYear}</span>
                                    </div>
                                )}

                                {/* Runtime */}
                                {movie.runtime && (
                                    <div className="flex items-center gap-1.5">
                                        <FiClock className="text-gray-400" />
                                        <span>{formatRuntime(movie.runtime)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Genres */}
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {movie.genres.map(genre => (
                                        <span
                                            key={genre.id}
                                            className="px-3 py-1 text-xs font-medium text-white bg-[#C43A3A]/80 rounded-full"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={changeLikedState}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${isLiked
                                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                        }`}
                                >
                                    {isLiked ? <FaHeart /> : <FiHeart />}
                                    {isLiked ? 'Favorited' : 'Add to Favorites'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-24 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column - Overview & Cast */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Overview */}
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                                Overview
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-base">
                                {movie.overview || 'No overview available for this movie.'}
                            </p>
                        </section>

                        {/* Cast */}
                        {cast.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                                    Top Cast
                                </h2>
                                <div className="flex gap-4 overflow-x-auto pb-4 cast-scroll">
                                    {cast.map(person => (
                                        <Link
                                            to={`/castdetails/${person.id}`}
                                            key={person.id}
                                            className="flex-shrink-0 w-28 text-center group cursor-pointer"
                                        >
                                            <div className="w-28 h-28 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-[#C43A3A] transition-colors">
                                                {person.profile_path ? (
                                                    <img
                                                        src={getProfileUrl(person.profile_path)}
                                                        alt={person.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-2xl">
                                                        👤
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-white text-sm font-medium truncate">{person.name}</p>
                                            <p className="text-gray-500 text-xs truncate">{person.character}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Movie Info */}
                    <div className="space-y-6">
                        <div className="bg-[#242424] rounded-xl p-6 border border-white/5">
                            <h3 className="text-lg font-semibold text-white mb-4">Movie Info</h3>

                            <div className="space-y-4">
                                {/* Director */}
                                {director && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Director</p>
                                        <p className="text-white">{director.name}</p>
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <p className="text-gray-500 text-sm">Status</p>
                                    <p className="text-white">{movie.status || 'Unknown'}</p>
                                </div>

                                {/* Release Date */}
                                {movie.release_date && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Release Date</p>
                                        <p className="text-white">
                                            {new Date(movie.release_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}

                                {/* Original Language */}
                                <div>
                                    <p className="text-gray-500 text-sm">Language</p>
                                    <p className="text-white uppercase">{movie.original_language}</p>
                                </div>

                                {/* Budget */}
                                {movie.budget > 0 && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Budget</p>
                                        <p className="text-white">{formatMoney(movie.budget)}</p>
                                    </div>
                                )}

                                {/* Revenue */}
                                {movie.revenue > 0 && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Revenue</p>
                                        <p className="text-green-400">{formatMoney(movie.revenue)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Production Companies */}
                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div className="bg-[#242424] rounded-xl p-6 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-4">Production</h3>
                                <div className="space-y-3">
                                    {movie.production_companies.slice(0, 4).map(company => (
                                        <div key={company.id} className="flex items-center gap-3">
                                            {company.logo_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-6 w-auto object-contain bg-white rounded px-1"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                                                    🎬
                                                </div>
                                            )}
                                            <span className="text-gray-300 text-sm">{company.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Reviews id={movie.id} />
        </div>
    )
}

export default MovieDetails
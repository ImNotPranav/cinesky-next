import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { IoArrowBack } from 'react-icons/io5'
import { getPersonDetails, getProfileUrl, getPosterUrl } from '../api/getMovies'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const CastDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [person, setPerson] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPersonDetails = async () => {
            try {
                const data = await getPersonDetails(id)
                setPerson(data)
                setLoading(false)
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        fetchPersonDetails()
    }, [id])

    const calculateAge = (birthday, deathday = null) => {
        if (!birthday) return null
        const birth = new Date(birthday)
        const end = deathday ? new Date(deathday) : new Date()
        let age = end.getFullYear() - birth.getFullYear()
        const monthDiff = end.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    const formatDate = (dateString) => {
        if (!dateString) return null
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="bg-[#1A1A1A] flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-[#C43A3A] animate-spin" />
                    <p className="text-gray-400 text-sm">Loading details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-[#1A1A1A] flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
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

    const knownFor = person.movie_credits?.cast
        ?.sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10) || []

    const age = calculateAge(person.birthday, person.deathday)

    return (
        <div className='bg-[#1A1A1A] min-h-screen'>
            <Navbar />

            {/* Hero Section */}
            <div className="relative w-full h-[70vh] overflow-hidden">
                {/* Back Button */}
                <button
                    className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <IoArrowBack className="text-xl text-white" />
                </button>

                {/* Background - Blurred profile or gradient */}
                <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#151515]">
                    {person.profile_path && (
                        <img
                            src={getProfileUrl(person.profile_path)}
                            alt=""
                            className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
                        />
                    )}
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-end md:items-end">

                        {/* Profile Image */}
                        <div className="hidden md:block flex-shrink-0 w-48 lg:w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 transform translate-y-16">
                            {person.profile_path ? (
                                <img
                                    src={getProfileUrl(person.profile_path)}
                                    alt={person.name}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#151515] flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl opacity-30">👤</span>
                                        <p className="text-gray-500 text-sm mt-2">No Photo</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Person Info */}
                        <div className="flex-1 pb-4">
                            {/* Name */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                                {person.name}
                            </h1>

                            {/* Known For Department */}
                            {person.known_for_department && (
                                <p className="text-gray-300 text-lg mb-4">{person.known_for_department}</p>
                            )}

                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-5">
                                {/* Birthday & Age */}
                                {person.birthday && (
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                                        <FiCalendar className="text-gray-400" />
                                        <span>{formatDate(person.birthday)}</span>
                                        {age && !person.deathday && (
                                            <span className="text-gray-500">({age} years old)</span>
                                        )}
                                    </div>
                                )}

                                {/* Deathday */}
                                {person.deathday && (
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                                        <span className="text-gray-400">✝</span>
                                        <span>{formatDate(person.deathday)}</span>
                                        {age && (
                                            <span className="text-gray-500">(aged {age})</span>
                                        )}
                                    </div>
                                )}

                                {/* Birthplace */}
                                {person.place_of_birth && (
                                    <div className="flex items-center gap-1.5">
                                        <FiMapPin className="text-gray-400" />
                                        <span>{person.place_of_birth}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-24 pb-16">
                {/* Biography */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                        Biography
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-base">
                        {person.biography || `We don't have a biography for ${person.name} yet.`}
                    </p>
                </section>

                {/* Known For - Movies */}
                {knownFor.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                            Known For
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 cast-scroll">
                            {knownFor.map(movie => (
                                <Link
                                    to={`/moviedetails/${movie.id}`}
                                    key={movie.id}
                                    className="flex-shrink-0 w-32 group"
                                >
                                    <div className="w-32 aspect-[2/3] rounded-lg overflow-hidden mb-2 border-2 border-transparent group-hover:border-[#C43A3A] transition-colors">
                                        {movie.poster_path ? (
                                            <img
                                                src={getPosterUrl(movie.poster_path)}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#151515] flex items-center justify-center">
                                                <span className="text-2xl opacity-30">🎬</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                                    <p className="text-gray-500 text-xs truncate">{movie.character || 'Unknown Role'}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default CastDetails
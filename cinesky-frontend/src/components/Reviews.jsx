import React, { useEffect, useState } from 'react'
import { getReviews } from '../api/getMovies'
import { FiStar, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const Reviews = ({ id }) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedReviews, setExpandedReviews] = useState({})

    useEffect(() => {
        async function fetchReviews() {
            try {
                const data = await getReviews(id)
                setReviews(data.results || [])
            } catch (error) {
                console.error('Failed to fetch reviews:', error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchReviews()
    }, [id])

    const toggleExpand = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }))
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getAvatarUrl = (authorDetails) => {
        if (!authorDetails?.avatar_path) return null
        // TMDB avatar paths can be full URLs or relative paths
        if (authorDetails.avatar_path.startsWith('/https')) {
            return authorDetails.avatar_path.substring(1)
        }
        return `https://image.tmdb.org/t/p/w45${authorDetails.avatar_path}`
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                    <h2 className="text-xl font-semibold text-white">Reviews</h2>
                </div>
                <div className="flex justify-center py-8">
                    <div className="h-8 w-8 rounded-full border-3 border-gray-700 border-t-[#C43A3A] animate-spin" />
                </div>
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                    <h2 className="text-xl font-semibold text-white">Reviews</h2>
                </div>
                <div className="bg-[#242424] rounded-xl p-8 border border-white/5 text-center">
                    <p className="text-gray-400">No reviews yet for this movie.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
            <div className="flex items-center gap-2 mb-6">
                <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                <h2 className="text-xl font-semibold text-white">Reviews</h2>
                <span className="text-gray-500 text-sm">({reviews.length})</span>
            </div>

            <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => {
                    const isExpanded = expandedReviews[review.id]
                    const isLongContent = review.content.length > 400
                    const displayContent = isLongContent && !isExpanded
                        ? review.content.substring(0, 400) + '...'
                        : review.content
                    const avatarUrl = getAvatarUrl(review.author_details)
                    const rating = review.author_details?.rating

                    return (
                        <div
                            key={review.id}
                            className="bg-[#242424] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={review.author}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextSibling.style.display = 'flex'
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full flex items-center justify-center ${avatarUrl ? 'hidden' : ''}`}>
                                            <FiUser className="text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Author Info */}
                                    <div>
                                        <h3 className="text-white font-medium">{review.author}</h3>
                                        <p className="text-gray-500 text-xs">{formatDate(review.created_at)}</p>
                                    </div>
                                </div>

                                {/* Rating Badge */}
                                {rating && (
                                    <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                                        <FiStar className="text-yellow-400 text-sm" />
                                        <span className="text-white text-sm font-medium">{rating}/10</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {displayContent}
                            </p>

                            {/* Expand/Collapse Button */}
                            {isLongContent && (
                                <button
                                    onClick={() => toggleExpand(review.id)}
                                    className="mt-3 flex items-center gap-1 text-[#C43A3A] hover:text-[#e04545] text-sm font-medium transition-colors"
                                >
                                    {isExpanded ? (
                                        <>
                                            <FiChevronUp />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <FiChevronDown />
                                            Read More
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Show More Reviews Link */}
            {reviews.length > 5 && (
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Showing 5 of {reviews.length} reviews
                    </p>
                </div>
            )}
        </div>
    )
}

export default Reviews
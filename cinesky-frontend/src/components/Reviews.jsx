import React, { useEffect, useState } from 'react'
import { getReviews } from '../api/getMovies'
import { getMovieReviews, addReview, deleteReview } from '../api/reviews'
import { useAuth } from '../contexts/AuthContext'
import { FiStar, FiUser, FiChevronDown, FiChevronUp, FiTrash2, FiSend } from 'react-icons/fi'

const Reviews = ({ id }) => {
    const { user } = useAuth()
    const [tmdbReviews, setTmdbReviews] = useState([])
    const [userReviews, setUserReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedReviews, setExpandedReviews] = useState({})

    // Form state
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')

    const fetchAllReviews = async () => {
        try {
            const [tmdbData, userData] = await Promise.all([
                getReviews(id),
                getMovieReviews(id).catch(() => [])
            ])
            setTmdbReviews(tmdbData.results || [])
            setUserReviews(userData || [])
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchAllReviews()
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
        if (authorDetails.avatar_path.startsWith('/https')) {
            return authorDetails.avatar_path.substring(1)
        }
        return `https://image.tmdb.org/t/p/w45${authorDetails.avatar_path}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setFormSuccess('')

        if (rating === 0) {
            setFormError('Please select a rating')
            return
        }
        if (content.trim().length < 10) {
            setFormError('Review must be at least 10 characters')
            return
        }
        if (content.trim().length > 500) {
            setFormError('Review must be under 500 characters')
            return
        }

        setSubmitting(true)
        try {
            await addReview(id, rating, content.trim())
            setFormSuccess('Review submitted!')
            setRating(0)
            setContent('')
            await fetchAllReviews()
            setTimeout(() => setFormSuccess(''), 3000)
        } catch (error) {
            setFormError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (movieId) => {
        try {
            await deleteReview(movieId)
            await fetchAllReviews()
        } catch (error) {
            console.error('Failed to delete review:', error)
        }
    }

    // Check if the current user already has a review for this movie
    const currentUserReview = user
        ? userReviews.find(r => r.userId?._id === user.userId || r.userId === user.userId)
        : null

    const totalCount = tmdbReviews.length + userReviews.length

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

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
            <div className="flex items-center gap-2 mb-6">
                <span className="w-1 h-6 bg-[#C43A3A] rounded-full"></span>
                <h2 className="text-xl font-semibold text-white">Reviews</h2>
                {totalCount > 0 && (
                    <span className="text-gray-500 text-sm">({totalCount})</span>
                )}
            </div>

            {/* Review Form — only for logged-in users who haven't reviewed yet */}
            {user && !currentUserReview && (
                <form onSubmit={handleSubmit} className="bg-[#242424] rounded-xl p-5 border border-white/5 mb-6">
                    <h3 className="text-white font-medium mb-4">Write a Review</h3>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4">
                        <span className="text-gray-400 text-sm mr-2">Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-0.5 transition-transform hover:scale-110"
                            >
                                <FiStar
                                    className={`text-xl transition-colors ${star <= (hoverRating || rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                    style={{
                                        fill: star <= (hoverRating || rating) ? '#facc15' : 'none'
                                    }}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="text-gray-400 text-sm ml-2">{rating}/5</span>
                        )}
                    </div>

                    {/* Textarea */}
                    <div className="mb-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts about this movie..."
                            rows={4}
                            maxLength={500}
                            className="w-full bg-[#1A1A1A] text-gray-200 rounded-lg p-3 border border-white/10 focus:border-[#C43A3A] focus:outline-none resize-none placeholder-gray-600 text-sm transition-colors"
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-gray-600 text-xs">Min 10 characters</span>
                            <span className={`text-xs ${content.length > 450 ? 'text-[#C43A3A]' : 'text-gray-600'}`}>
                                {content.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Error / Success */}
                    {formError && (
                        <p className="text-red-400 text-sm mb-3">{formError}</p>
                    )}
                    {formSuccess && (
                        <p className="text-green-400 text-sm mb-3">{formSuccess}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#C43A3A] text-white rounded-lg font-medium hover:bg-[#a83232] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <FiSend className="text-sm" />
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* User Reviews Section */}
            {userReviews.length > 0 && (
                <div className="space-y-4 mb-6">
                    {userReviews.map((review) => {
                        const isExpanded = expandedReviews[`user-${review._id}`]
                        const isLongContent = review.content.length > 400
                        const displayContent = isLongContent && !isExpanded
                            ? review.content.substring(0, 400) + '...'
                            : review.content
                        const isOwn = user && (review.userId?._id === user.userId || review.userId === user.userId)
                        const authorName = review.userId?.name || 'User'

                        return (
                            <div
                                key={`user-${review._id}`}
                                className={`bg-[#242424] rounded-xl p-5 border ${isOwn ? 'border-[#C43A3A]/30' : 'border-white/5'} hover:border-white/10 transition-colors`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img
                                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=C43A3A&textColor=ffffff&fontSize=40`}
                                                alt={authorName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Author Info */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-white font-medium">{authorName}</h3>
                                                {isOwn && (
                                                    <span className="text-[10px] font-bold text-[#C43A3A] bg-[#C43A3A]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        Your Review
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs">{formatDate(review.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Rating Badge */}
                                        {review.rating && (
                                            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                                                <FiStar className="text-yellow-400 text-sm" style={{ fill: '#facc15' }} />
                                                <span className="text-white text-sm font-medium">{review.rating}/5</span>
                                            </div>
                                        )}

                                        {/* Delete button for own review */}
                                        {isOwn && (
                                            <button
                                                onClick={() => handleDelete(review.movieId)}
                                                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                                                title="Delete your review"
                                            >
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {displayContent}
                                </p>

                                {/* Expand/Collapse Button */}
                                {isLongContent && (
                                    <button
                                        onClick={() => toggleExpand(`user-${review._id}`)}
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
            )}

            {/* TMDB Reviews Section */}
            {tmdbReviews.length > 0 && (
                <>
                    {userReviews.length > 0 && (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px flex-1 bg-white/5"></div>
                            <span className="text-gray-500 text-xs uppercase tracking-wider">TMDB Reviews</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>
                    )}
                    <div className="space-y-4">
                        {tmdbReviews.slice(0, 5).map((review) => {
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
                    {tmdbReviews.length > 5 && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                Showing 5 of {tmdbReviews.length} TMDB reviews
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Empty state — only when there are no reviews at all and no form */}
            {totalCount === 0 && (!user || currentUserReview) && (
                <div className="bg-[#242424] rounded-xl p-8 border border-white/5 text-center">
                    <p className="text-gray-400">No reviews yet for this movie.</p>
                </div>
            )}
        </div>
    )
}

export default Reviews
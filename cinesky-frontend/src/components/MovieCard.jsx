import React from 'react'
import { getPosterUrl } from '../api/getMovies'

export default function MovieCard({ movie }) {
  const posterUrl = getPosterUrl(movie.poster_path)
  const date = new Date(movie.release_date)
  return (
    <div className="my-2 mx-2 w-full sm:w-[40%] md:w-[200px] bg-[#202020] shadow-lg shadow-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-white hover:bg-[#242424] hover:scale-105 transition duration-200 hover:cursor-pointer">

      {/* Poster */}
      <div className="aspect-[2/3] relative">
        {movie.poster_path ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#151515] flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl opacity-30">🎬</span>
              <p className="text-gray-500 text-xs mt-1">No Poster</p>
            </div>
          </div>
        )}
        {movie.adult && (
          <span className="absolute top-2 right-2 bg-red-600/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            A
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h2 className="text-sm font-semibold text-white truncate">
          {movie.title}
        </h2>

        <div className="flex justify-between items-center mt-1 text-xs text-zinc-400">
          <span>{date.getFullYear()}</span>
          <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>

  )
}

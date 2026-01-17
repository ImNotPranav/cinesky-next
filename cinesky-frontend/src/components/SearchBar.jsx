import React, { useEffect } from 'react'
import { searchMovies } from '../api/getMovies'
import { useSearch } from '../contexts/SearchContext'

const SearchBar = ({ onSearchResults }) => {
    const { searchQuery, setSearchQuery } = useSearch()

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const data = await searchMovies(searchQuery)
            onSearchResults(data.results, true)
        } else {
            onSearchResults([], false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 200); // 0.2 second delay

        return () => clearTimeout(timer); // cleanup if user types again
    }, [searchQuery]);

    return (
        <div className='bg-[#1A1A1A] p-3 flex items-center justify-center'>
            <div className='relative w-4/5'>
                <svg
                    className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50'
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full p-2 pl-10 rounded-xl border border-white/10 bg-[#1A1A1A] text-white'
                />
            </div>
        </div>
    )
}

// export { searchQuery, setSearchQuery }
export default SearchBar;
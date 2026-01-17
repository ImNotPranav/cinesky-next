import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { setSearchQuery } = useSearch()
    const { user, logout, deleteAccount } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = async () => {
        setDropdownOpen(false)
        try {
            await logout()
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    const handleDeleteClick = () => {
        setDropdownOpen(false)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        setDeleting(true)
        try {
            await deleteAccount()
            setShowDeleteModal(false)
        } catch (err) {
            console.error("Delete account failed:", err)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <nav className="bg-[#121212] h-16 flex items-center justify-between px-6">
                <NavLink to="/" onClick={() => setSearchQuery('')}>
                    <h1 className="font-cinzel font-bold opacity-90 text-2xl tracking-wide text-[#C43A3A] select-none">CineSky Next</h1>
                </NavLink>
                <div className="flex items-center gap-6">
                    <NavLink className="text-[#EDEDED] hover:text-[#C43A3A] cursor-pointer" to="/favorites">Favorites</NavLink>
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 text-[#EDEDED] hover:text-[#C43A3A] cursor-pointer transition-colors"
                            >
                                <span>{user.name}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left text-[#EDEDED] hover:bg-white/5 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/5 transition-colors border-t border-white/10"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink className="text-[#EDEDED] hover:text-[#C43A3A] cursor-pointer" to="/login">Sign In</NavLink>
                    )}
                </div>
            </nav>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Delete Account?</h3>
                            <p className="text-white/50 text-sm">
                                This will permanently delete your account and all your favorites. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
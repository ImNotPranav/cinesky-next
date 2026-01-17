import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites as apiFetchFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '../api/favorites';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load favorites when user changes
    useEffect(() => {
        async function loadFavorites() {
            if (user) {
                setLoading(true);
                try {
                    const data = await apiFetchFavorites();
                    if (data) {
                        // Map database format to component format
                        setFavoriteMovies(data.map(f => ({
                            id: f.movieId,
                            title: f.title,
                            poster_path: f.poster_path,
                            vote_average: f.vote_average,
                        })));
                    }
                } catch (err) {
                    console.error("Failed to load favorites:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Not logged in - use localStorage
                const saved = localStorage.getItem('favoriteMovies');
                setFavoriteMovies(saved ? JSON.parse(saved) : []);
            }
        }
        loadFavorites();
    }, [user]);

    // Save to localStorage when not logged in
    useEffect(() => {
        if (!user) {
            localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
        }
    }, [favoriteMovies, user]);

    const addFavorite = async (movie) => {
        if (user) {
            try {
                await apiAddFavorite(movie);
                setFavoriteMovies(prev => [...prev, movie]);
            } catch (err) {
                console.error("Failed to add favorite:", err);
                throw err;
            }
        } else {
            setFavoriteMovies(prev => [...prev, movie]);
        }
    };

    const removeFavorite = async (movieId) => {
        if (user) {
            try {
                await apiRemoveFavorite(movieId);
                setFavoriteMovies(prev => prev.filter(m => m.id !== movieId));
            } catch (err) {
                console.error("Failed to remove favorite:", err);
                throw err;
            }
        } else {
            setFavoriteMovies(prev => prev.filter(m => m.id !== movieId));
        }
    };

    const isFavorite = (movieId) => {
        return favoriteMovies.some(m => m.id === movieId);
    };

    return (
        <FavoritesContext.Provider value={{ favoriteMovies, addFavorite, removeFavorite, isFavorite, loading }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};


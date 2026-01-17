const API_URL = import.meta.env.VITE_API_URL;

export async function getFavorites() {
    const res = await fetch(`${API_URL}/favorites`, {
        credentials: "include",
    });
    if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch favorites");
    }
    return res.json();
}

export async function addFavorite(movie) {
    const res = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add favorite");
    return data;
}

export async function removeFavorite(movieId) {
    const res = await fetch(`${API_URL}/favorites/${movieId}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove favorite");
    return data;
}

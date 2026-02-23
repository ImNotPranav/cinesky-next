const API_URL = import.meta.env.VITE_API_URL;

export async function getMovieReviews(movieId) {
    const res = await fetch(`${API_URL}/reviews/${movieId}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
}

export async function addReview(movieId, rating, content) {
    const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movieId, rating, content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add review");
    return data;
}

export async function deleteReview(movieId) {
    const res = await fetch(`${API_URL}/reviews/${movieId}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete review");
    return data;
}

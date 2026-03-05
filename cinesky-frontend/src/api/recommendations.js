const API_URL = import.meta.env.VITE_API_URL;

export async function getRecommendations() {
    const res = await fetch(`${API_URL}/recommendations`, {
        credentials: "include",
    });
    if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch recommendations");
    }
    const data = await res.json();
    return data.results;
}

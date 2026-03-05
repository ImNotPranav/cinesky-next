import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import requests

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/cinesky")


def get_user_favorites(user_id: str) -> list[dict]:
    """Fetch a specific user's favorites from MongoDB and return as a list."""
    client = MongoClient(MONGODB_URI)
    db = client["cinesky"]
    favorites = list(db["favorites"].find(
        {"userId": ObjectId(user_id)},
        {"_id": 0, "movieId": 1, "title": 1, "poster_path": 1, "vote_average": 1}
    ))
    client.close()
    return favorites

def get_candidate_movies() -> list[dict]:
    all_movies=[]
    for page in range(1,6):
        res = requests.get(f"https://api.themoviedb.org/3/movie/popular",headers= {
        "Authorization": f"Bearer {os.getenv('TMDB_BEARER_TOKEN')}",
        "Content-Type": "application/json",
        },params={"page":page})
        all_movies.extend(res.json()["results"])
    return all_movies

TMDB_HEADERS = {
    "Authorization": f"Bearer {os.getenv('TMDB_BEARER_TOKEN')}",
    "Content-Type": "application/json",
}

# Map genre IDs to names for richer text features
GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
}


def get_movie_details_tmdb(movie_id: int) -> dict | None:
    """Fetch full movie details from TMDB (includes overview & genres)."""
    try:
        res = requests.get(
            f"https://api.themoviedb.org/3/movie/{movie_id}",
            headers=TMDB_HEADERS,
        )
        if res.ok:
            return res.json()
    except requests.RequestException:
        pass
    return None


def _build_feature_text(movie: dict) -> str:
    """Build a combined text feature from overview and genres for TF-IDF."""
    overview = movie.get("overview", "")
    # Support both full genre objects and plain genre_ids
    if "genres" in movie:
        genres = " ".join(g["name"] for g in movie["genres"])
    else:
        genre_ids = movie.get("genre_ids", [])
        genres = " ".join(GENRE_MAP.get(gid, "") for gid in genre_ids)
    return f"{overview} {genres}".strip()


def get_recommendations(user_id: str, top_n: int = 20) -> list[dict]:
    """
    Content-based movie recommender.

    1. Fetches the user's favorites from MongoDB.
    2. Enriches each favorite with TMDB details (overview, genres).
    3. Fetches candidate popular movies from TMDB.
    4. Builds TF-IDF vectors over combined overview+genre text.
    5. Averages the user's favorite vectors into a profile vector.
    6. Ranks candidates by cosine similarity to the profile.
    7. Returns the top-N recommendations (excluding already-favorited movies).
    """
    # --- 1. User favorites ---------------------------------------------------
    favorites = get_user_favorites(user_id)
    if not favorites:
        # No favorites -> fall back to plain popular movies
        return get_candidate_movies()[:top_n]

    fav_movie_ids = {f["movieId"] for f in favorites}

    # --- 2. Enrich favorites with TMDB data ----------------------------------
    enriched_favorites = []
    for fav in favorites:
        details = get_movie_details_tmdb(fav["movieId"])
        if details:
            enriched_favorites.append(details)

    if not enriched_favorites:
        return get_candidate_movies()[:top_n]

    # --- 3. Candidate movies --------------------------------------------------
    candidates = get_candidate_movies()
    # Remove movies the user already likes
    candidates = [m for m in candidates if m["id"] not in fav_movie_ids]
    if not candidates:
        return []

    # --- 4. Build TF-IDF matrix -----------------------------------------------
    all_movies = enriched_favorites + candidates
    corpus = [_build_feature_text(m) for m in all_movies]

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(corpus)

    n_fav = len(enriched_favorites)
    fav_vectors = tfidf_matrix[:n_fav]
    candidate_vectors = tfidf_matrix[n_fav:]

    # --- 5. User profile (mean of favorite vectors) ---------------------------
    user_profile = fav_vectors.mean(axis=0)
    # Convert to 2-D array for cosine_similarity
    user_profile = np.asarray(user_profile)

    # --- 6. Cosine similarity -------------------------------------------------
    similarities = cosine_similarity(user_profile, candidate_vectors).flatten()

    # --- 7. Rank and return top-N ---------------------------------------------
    top_indices = similarities.argsort()[::-1][:top_n]

    recommendations = []
    for idx in top_indices:
        movie = candidates[idx]
        recommendations.append({
            "id": movie["id"],
            "title": movie.get("title", ""),
            "overview": movie.get("overview", ""),
            "poster_path": movie.get("poster_path", ""),
            "backdrop_path": movie.get("backdrop_path", ""),
            "release_date": movie.get("release_date", ""),
            "vote_average": movie.get("vote_average", 0),
            "genre_ids": movie.get("genre_ids", []),
            "similarity_score": round(float(similarities[idx]), 4),
        })
    return recommendations


# ---------- Example usage ----------
if __name__ == "__main__":
    USER_ID = "696a0f1fb3728d2232a4b30f"

    print("=== User Favorites ===")
    user_favorites = get_user_favorites(USER_ID)
    df = pd.DataFrame(user_favorites)
    print(df)

    print("\n=== Recommendations ===")
    recs = get_recommendations(USER_ID, top_n=10)
    df_recs = pd.DataFrame(recs)
    if not df_recs.empty:
        print(df_recs[["title", "vote_average", "similarity_score"]])
    else:
        print("No recommendations found.")

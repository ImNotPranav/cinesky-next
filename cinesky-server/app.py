from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommender_system import get_recommendations
import uvicorn

app = FastAPI(title="Cinesky Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/recommendations")
def recommendations(user_id: str = Query(..., description="MongoDB user ObjectId")):
    try:
        recs = get_recommendations(user_id, top_n=20)
        return {"results": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)

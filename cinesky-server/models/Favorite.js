import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movieId: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        poster_path: {
            type: String,
        },
        vote_average: {
            type: Number,
        },
    },
    { timestamps: true }
);

// Compound index to ensure user can't favorite same movie twice
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);

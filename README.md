# 🎬 CineSky

A full-stack movie web application built with the MERN stack. Browse, search, and save your favorite movies!

---

## ✨ Features

- 🔍 Search for movies
- 📈 Browse trending / popular movies
- 🎞️ View movie details (overview, rating, cast, reviews)
- 👤 User authentication (signup/login)
- ❤️ Save favorite movies (synced to database)
- 📱 Responsive UI (mobile + desktop)

---

## 🛠️ Tech Stack

### Frontend (`cinesky-frontend/`)
- React.js + Vite
- React Router
- Tailwind CSS
- TMDB API

### Backend (`cinesky-server/`)
- Express.js
- MongoDB + Mongoose
- JWT (httpOnly cookies)
- bcrypt (password hashing)

---

## 📦 Setup

### 1) Clone the repo
```bash
git clone https://github.com/ImNotPranav/cinesky.git
cd cinesky
```

### 2) Setup Frontend
```bash
cd cinesky-frontend
npm install
```

Create `cinesky-frontend/.env`:
```env
VITE_TMDB_TOKEN="your-tmdb-bearer-token"
VITE_API_URL="http://localhost:4000"
```

### 3) Setup Backend
```bash
cd cinesky-server
npm install
```

Create `cinesky-server/.env`:
```env
FRONTEND_URL="http://localhost:5173"
MONGODB_URI="mongodb://localhost:27017/cinesky"
JWT_SECRET="your-secure-random-secret-key-here"
```

### 4) Run

**Backend** (runs on `http://localhost:4000`):
```bash
cd cinesky-server
npm run dev
```

**Frontend** (runs on `http://localhost:5173`):
```bash
cd cinesky-frontend
npm run dev
```

---

## 📁 Project Structure

```
cinesky/
├── cinesky-frontend/
│   └── src/
│       ├── api/          # API functions (auth, favorites, movies)
│       ├── components/   # Navbar, MovieCard, SearchBar, Reviews
│       ├── contexts/     # AuthContext, FavoritesContext, SearchContext
│       ├── pages/        # Home, Login, MovieDetails, CastDetails, Favorites
│       └── main.jsx      # App entry point
│
└── cinesky-server/
    ├── middleware/       # Auth middleware
    ├── models/           # User, Favorite schemas
    └── index.js          # Server entry point
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Create new account | No |
| POST | `/auth/login` | Login & get token cookie | No |
| POST | `/auth/logout` | Clear auth cookie | No |
| DELETE | `/auth/account` | Delete account & data | Yes |

### Favorites

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/favorites` | Get user's favorites | Yes |
| POST | `/favorites` | Add movie to favorites | Yes |
| DELETE | `/favorites/:movieId` | Remove from favorites | Yes |

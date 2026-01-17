import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import MovieDetails from './pages/MovieDetails'
import CastDetails from './pages/CastDetails'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AuthProvider } from './contexts/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/moviedetails/:id" element={<MovieDetails />} />
          <Route path="/castdetails/:id" element={<CastDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
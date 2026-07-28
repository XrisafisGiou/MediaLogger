import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import TVShows from "./pages/TVShows.jsx";
import TvShowDetails from "./pages/TvShowDetails.jsx";
import Games from "./pages/Games.jsx";
import GameDetails from "./pages/GameDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/games" element={<Games />} />

          <Route path="/movie/:externalId" element={<MovieDetails />} />
          <Route path="/tv/:externalId" element={<TvShowDetails />} />
          <Route path="/game/:externalId" element={<GameDetails />} />
          
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
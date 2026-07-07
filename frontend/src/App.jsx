import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>} 
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:tmdbId"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
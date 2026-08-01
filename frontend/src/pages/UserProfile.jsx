import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import {
  changePassword,
  getCurrentUser,
  getMovies,
  getTvShows,
  getGames,
  getBooks,
} from "../services/api.js";
import BackButton from "../components/common/BackButton";
import StatGrid from "../components/common/StatGrid";
import PageShell from "../components/layout/PageShell";
import PasswordForm from "../components/profile/PasswordForm";

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    watched: 0,
    watchlist: 0,
    favorites: 0,
  });

  useEffect(() => {
    async function loadProfile() {
      const [userData, movies, tvShows, games, books] =
        await Promise.all([
          getCurrentUser(),
          getMovies(),
          getTvShows(),
          getGames(),
          getBooks(),
        ]);

      const media = [
        ...movies,
        ...tvShows,
        ...games,
        ...books,
      ];

      setUser(userData);
      setStats({
        watched: media.filter((item) => item.status === "watched").length,
        watchlist: media.filter((item) => item.status === "watchlist").length,
        favorites: media.filter((item) => item.isFavorite).length,
      });
    }

    loadProfile();
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <PageShell contentClassName="mx-auto max-w-3xl p-6">
      <BackButton onClick={() => navigate(-1)} className="mb-6" />

      <section className="rounded-xl border border-white/20 bg-white/10 p-8">
        <h1 className="mb-6 text-3xl font-bold">Profile</h1>

        <p className="text-white/50">Username</p>
        <p className="mb-8 text-xl">{user?.username}</p>

        <StatGrid
          items={[
            { key: "watched", label: "Watched", value: stats.watched },
            { key: "watchlist", label: "Watchlist", value: stats.watchlist },
            { key: "favorites", label: "Favorites", value: stats.favorites },
          ]}
        />
        <PasswordForm onSubmit={changePassword} />

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-2 transition hover:bg-red-500/40"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </section>
    </PageShell>
  );
}

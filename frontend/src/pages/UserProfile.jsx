import {
  useEffect,
  useState,
} from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import {
  changePassword,
  getBooks,
  getCurrentUser,
  getGames,
  getMovies,
  getTvShows,
} from "../services/api.js";
import BackButton from "../components/common/BackButton";
import PageShell from "../components/layout/PageShell";
import PasswordForm from "../components/profile/PasswordForm";
import ProfileStatsSection from "../components/profile/ProfileStatsSection";

const emptyCollections = {
  movies: [],
  tvShows: [],
  games: [],
  books: [],
};

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [collections, setCollections] =
    useState(emptyCollections);

  useEffect(() => {
    async function loadProfile() {
      const [
        userData,
        movies,
        tvShows,
        games,
        books,
      ] = await Promise.all([
        getCurrentUser(),
        getMovies(),
        getTvShows(),
        getGames(),
        getBooks(),
      ]);

      setUser(userData);

      setCollections({
        movies,
        tvShows,
        games,
        books,
      });
    }

    loadProfile();
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <PageShell contentClassName="mx-auto max-w-4xl p-6">
      <BackButton
        onClick={() => navigate(-1)}
        className="mb-6"
      />

      <section className="rounded-xl border border-white/20 bg-white/10 p-8">
        <h1 className="mb-6 text-3xl font-bold">{user?.username}</h1>

        <div className="space-y-8">
          <ProfileStatsSection
            title="Movies"
            entries={collections.movies}
            completedLabel="Watched"
            plannedLabel="Watchlist"
          />

          <ProfileStatsSection
            title="TV Shows"
            entries={collections.tvShows}
            completedLabel="Watched"
            plannedLabel="Watchlist"
          />

          <ProfileStatsSection
            title="Games"
            entries={collections.games}
            completedLabel="Played"
            plannedLabel="Want to Play"
          />

          <ProfileStatsSection
            title="Books"
            entries={collections.books}
            completedLabel="Read"
            plannedLabel="Reading List"
          />
        </div>

        <PasswordForm
          onSubmit={changePassword}
        />

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-2 transition hover:bg-red-500/40"
        >
          <LogOut
            size={18}
            aria-hidden="true"
          />
          Logout
        </button>
      </section>
    </PageShell>
  );
}
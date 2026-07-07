import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, getMovies, changePassword } from "../services/api.js";


export default function UserProfile() {

  const navigate = useNavigate();
  const { logout } = useAuth();
  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    watched: 0,
    watchlist: 0,
    favorites: 0,
  });


  useEffect(() => {

    async function loadProfile() {

      const userData = await getCurrentUser();
      const movies = await getMovies();

      setUser(userData);

      setStats({
        watched: movies.filter(
          movie => movie.status === "watched"
        ).length,

        watchlist: movies.filter(
          movie => movie.status === "watchlist"
        ).length,

        favorites: movies.filter(
          movie => movie.isFavorite
        ).length,
      });

    }

    loadProfile();

  }, []);



  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-purple-950 to-black text-white">

      <div className="max-w-3xl mx-auto">


        <button
          onClick={() => navigate("/movies")}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowLeft size={18}/>
          Back
        </button>


        <div className="bg-white/10 border border-white/20 rounded-xl p-8">


          <h1 className="text-3xl font-bold mb-6">
            Profile
          </h1>


          <p className="text-white/50">
            Username
          </p>

          <p className="text-xl mb-8">
            {user?.username}
          </p>



          <div className="grid grid-cols-3 gap-4">


            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">
                {stats.watched}
              </p>

              <p className="text-white/60">
                Watched
              </p>
            </div>


            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">
                {stats.watchlist}
              </p>

              <p className="text-white/60">
                Watchlist
              </p>
            </div>


            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">
                {stats.favorites}
              </p>

              <p className="text-white/60">
                Favorites
              </p>
            </div>


          </div>

        <div className="mt-8 border-t border-white/20 pt-6">

        <h2 className="text-xl font-bold mb-4">
            Security
        </h2>


        {!changingPassword ? (

            <button
            onClick={() => {
                setChangingPassword(true);
                setPasswordMessage("");
            }}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
            >
            Change Password
            </button>

        ) : (

            <div className="space-y-3">

            <input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20"
            />


            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20"
            />


            <div className="flex gap-3">

                <button
                onClick={async () => {

                    try {

                    const data = await changePassword({
                        oldPassword,
                        newPassword
                    });

                    setPasswordMessage(data.message);

                    setOldPassword("");
                    setNewPassword("");
                    setChangingPassword(false);

                    } catch(err) {

                    setPasswordMessage(
                        err.response?.data?.error ||
                        "Something went wrong"
                    );

                    }

                }}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
                >
                Save Password
                </button>


                <button
                onClick={() => {
                    setChangingPassword(false);
                    setOldPassword("");
                    setNewPassword("");
                    setPasswordMessage("");
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                Cancel
                </button>

            </div>


            </div>

        )}


        {passwordMessage && (
            <p className="mt-3 text-sm text-white/80">
            {passwordMessage}
            </p>
        )}

        </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/40 transition"
          >
            <LogOut size={18}/>
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
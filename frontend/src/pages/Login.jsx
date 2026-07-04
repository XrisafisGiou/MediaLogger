import { useState } from "react";
import { login as loginUser } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/bg_image.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  function validate() {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required!";
    if (!password.trim()) errors.password = "Password is required!";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const errors = validate();
    setTouched({ username: true, password: true });

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      const data = await loginUser(username, password); 

      if (data.token) {
        login(data.token); 
        navigate("/movies");
      }
    } catch (err) {
      setError("Invalid username or password!");
    } finally {
      setLoading(false);
    }
  }

  const errors = validate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, username: true }))}
            className={`border p-2 rounded w-full ${
              touched.username && errors.username ? "border-red-500" : ""
            }`}
          />
          {touched.username && errors.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            className={`border p-2 rounded w-full ${
              touched.password && errors.password ? "border-red-500" : ""
            }`}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-sm text-blue-600 hover:underline"
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
}
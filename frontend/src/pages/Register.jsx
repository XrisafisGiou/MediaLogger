import { useState } from "react";
import bg from "../assets/bg_image.png";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/api.js";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  function validate() {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required!";
    if (!password.trim()) errors.password = "Password is required!";
    else if (password.length < 4)
      errors.password = "Password must be at least 4 characters!";
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

      const data = await registerUser(username, password);

      if (data?.message || data?.id || data?.success) {
        navigate("/");
      } else {
        setError("Registration failed!");
      }
    } catch (err) {
      setError(
        err?.response?.data?.error || "Something went wrong during registration!"
      );
    } finally {
      setLoading(false);
    }
  }

  const errors = validate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Register</h1>

        <div>
          <input
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
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}
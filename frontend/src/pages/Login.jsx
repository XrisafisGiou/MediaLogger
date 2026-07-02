import { useState } from "react";
import { login } from "../services/api.js";
import bg from "../assets/bg_image.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await login(username, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/movies";
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="absolute inset-0 bg-black/50" />
      
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = "/register")}
          className="text-sm text-blue-600 hover:underline"
        >
          Don't have an account? Register
        </button>
      </form>

    </div>
  );
}
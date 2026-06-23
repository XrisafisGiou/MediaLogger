import { useState } from "react";
import { login } from "../services/api.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await login(username, password);
    console.log(data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/movies";
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <button type="button"onClick={() => window.location.href = "/register"}>
        Register
      </button>
    </div>
  );
}
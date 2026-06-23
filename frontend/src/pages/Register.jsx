import { useState } from "react";

const API_URL = "http://localhost:3000";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            window.location.href = "/";
        } else {
            alert(data.error || "Error registering user");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Register</button>
            <button type="button"onClick={() => window.location.href = "/"}>
             Already have an account? Login
            </button>
        </form>
    );
}
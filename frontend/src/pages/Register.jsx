import { useState } from "react";
import bg from "../assets/bg_image.png";

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

            <input
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

            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Register
            </button>
            <button type="button"onClick={() => window.location.href = "/"} className="text-sm text-blue-600 hover:underline">
             Already have an account? Login
            </button>
        </form>
    </div>
    );
}
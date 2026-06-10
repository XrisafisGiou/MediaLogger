const API_URL = "http://localhost:3000";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
}

export async function register(username, password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
}

export async function getMovies() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/movies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
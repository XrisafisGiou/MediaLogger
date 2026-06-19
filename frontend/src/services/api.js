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

export async function addMovie(tmdbMovieId, status, isFavorite = false) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tmdbMovieId,
            status,
            isFavorite,
        }),
    });

  return res.json();
}

export async function updateMovie(id, data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

export async function deleteMovie(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
}

export async function searchMovies(query) {
    const res = await fetch(
        `${import.meta.env.VITE_TMDB_BASE_URL}/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );

    return res.json();
}
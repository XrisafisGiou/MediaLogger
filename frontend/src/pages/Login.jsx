import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { login as loginUser } from "../services/api.js";
import AuthForm from "../components/auth/AuthForm";
import FormField from "../components/common/FormField";
import AuthLayout from "../components/layout/AuthLayout";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const errors = {
    ...(!username.trim() && { username: "Username is required!" }),
    ...(!password.trim() && { password: "Password is required!" }),
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setTouched({ username: true, password: true });

    if (Object.keys(errors).length) return;

    try {
      setLoading(true);
      const data = await loginUser(username, password);

      if (data.token) {
        login(data.token);
        navigate("/movies");
      }
    } catch {
      setError("Invalid username or password!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        title="Login"
        onSubmit={handleSubmit}
        error={error}
        submitLabel="Login"
        submittingLabel="Logging in..."
        loading={loading}
        alternateLabel="Don't have an account? Register"
        onAlternate={() => navigate("/register")}
      >
        <FormField
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, username: true }))}
          touched={touched.username}
          error={errors.username}
        />
        <FormField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          touched={touched.password}
          error={errors.password}
        />
      </AuthForm>
    </AuthLayout>
  );
}

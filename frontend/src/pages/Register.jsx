import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/api.js";
import AuthForm from "../components/auth/AuthForm";
import FormField from "../components/common/FormField";
import AuthLayout from "../components/layout/AuthLayout";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const errors = {
    ...(!username.trim() && { username: "Username is required!" }),
    ...(!password.trim()
      ? { password: "Password is required!" }
      : password.length < 4
        ? { password: "Password must be at least 4 characters!" }
        : {}),
    ...(!repeatPassword.trim()
      ? { repeatPassword: "Please repeat your password!" }
      : repeatPassword !== password
        ? { repeatPassword: "Passwords do not match!" }
        : {}),
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setTouched({ username: true, password: true, repeatPassword: true });

    if (Object.keys(errors).length) return;

    try {
      setLoading(true);
      const data = await registerUser(username, password);

      if (data?.user?.id) {
        navigate("/");
      } else {
        setError("Registration failed!");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Something went wrong during registration!",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthForm
        title="Register"
        onSubmit={handleSubmit}
        error={error}
        submitLabel="Register"
        submittingLabel="Creating account..."
        loading={loading}
        alternateLabel="Already have an account? Login"
        onAlternate={() => navigate("/")}
        submitClassName="bg-green-500 hover:bg-green-600"
      >
        <FormField
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
        <FormField
          type="password"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          onBlur={() =>
            setTouched((current) => ({ ...current, repeatPassword: true }))
          }
          touched={touched.repeatPassword}
          error={errors.repeatPassword}
        />
      </AuthForm>
    </AuthLayout>
  );
}

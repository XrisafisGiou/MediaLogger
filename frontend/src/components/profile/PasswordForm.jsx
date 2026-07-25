import { useState } from "react";

export default function PasswordForm({ onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function reset() {
    setIsOpen(false);
    setOldPassword("");
    setNewPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await onSubmit({ oldPassword, newPassword });
      setMessage(response.message);
      reset();
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mt-8 border-t border-white/20 pt-6">
      <h2 className="mb-4 text-xl font-bold">Security</h2>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setMessage("");
          }}
          className="rounded-lg bg-purple-600 px-4 py-2 transition hover:bg-purple-700"
        >
          Change Password
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            className="w-full rounded border border-white/20 bg-white/10 p-2"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded border border-white/20 bg-white/10 p-2"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-green-600 px-4 py-2 transition hover:bg-green-700 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setMessage("");
              }}
              className="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && <p className="mt-3 text-sm text-white/80">{message}</p>}
    </section>
  );
}

export default function AuthForm({
  title,
  onSubmit,
  error,
  submitLabel,
  submittingLabel,
  loading,
  alternateLabel,
  onAlternate,
  children,
  submitClassName = "bg-blue-500 hover:bg-blue-600",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col space-y-4 rounded-xl bg-white p-8 shadow-lg"
    >
      <h1 className="text-center text-xl font-bold">{title}</h1>
      {children}

      {error && (
        <div className="rounded bg-red-100 p-2 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`rounded p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${submitClassName}`}
      >
        {loading ? submittingLabel : submitLabel}
      </button>

      <button
        type="button"
        onClick={onAlternate}
        className="text-sm text-blue-600 hover:underline"
      >
        {alternateLabel}
      </button>
    </form>
  );
}

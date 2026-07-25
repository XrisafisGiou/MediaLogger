export default function FormField({
  error,
  touched,
  className = "",
  ...inputProps
}) {
  const showError = touched && error;

  return (
    <div>
      <input
        {...inputProps}
        aria-invalid={Boolean(showError)}
        className={`w-full rounded border p-2 ${
          showError ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {showError && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

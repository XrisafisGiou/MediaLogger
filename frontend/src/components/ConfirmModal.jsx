export default function ConfirmModal({
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-96 text-white shadow-xl">

        <h2 className="text-xl font-bold mb-3">
          {title}
        </h2>

        <p className="text-white/70 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}
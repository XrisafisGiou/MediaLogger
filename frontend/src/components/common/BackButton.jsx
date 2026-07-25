import { ArrowLeft } from "lucide-react";

export default function BackButton({ onClick, label = "Back", className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20 ${className}`}
    >
      <ArrowLeft size={18} aria-hidden="true" />
      {label}
    </button>
  );
}

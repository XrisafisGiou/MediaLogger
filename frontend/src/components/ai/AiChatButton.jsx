import { Bot } from "lucide-react";

export default function AiChatButton({
  onClick,
}) {
  return (
    <div className="group fixed bottom-6 right-6 z-40">
      <div
        className="
          pointer-events-none
          absolute
          bottom-full
          right-0
          mb-3
          whitespace-nowrap
          rounded-lg
          bg-slate-900
          px-3 py-2
          text-sm
          text-white
          opacity-0
          shadow-lg
          transition
          group-hover:opacity-100
        "
      >
        Ask Walter, your media know-it-all
      </div>

      <button
        type="button"
        onClick={onClick}
        aria-label="Open Walter AI"
        className="
          flex h-14 w-14
          items-center
          justify-center
          rounded-full
          bg-purple-600
          text-white
          shadow-lg
          transition
          hover:scale-105
          hover:bg-purple-500
        "
      >
        <Bot size={26} />
      </button>
    </div>
  );
}
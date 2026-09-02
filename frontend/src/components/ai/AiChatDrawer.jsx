import { useState } from "react";
import { X } from "lucide-react";
import { sendAiMessage } from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import ItemCard from "../common/ItemCard";
import { getTmdbImageUrl } from "../../utils/tmdbImages.js";
import { getIgdbImageUrl } from "../../utils/igdbImages.js";
import { getOpenLibraryImageUrl } from "../../utils/openLibraryImages.js";

function getMediaImageUrl(media) {
  if (media.type === "game") {
    return getIgdbImageUrl(
      media.poster_path,
    );
  }

  if (media.type === "book") {
    return getOpenLibraryImageUrl(
      media.poster_path,
    );
  }

  return getTmdbImageUrl(
    media.poster_path,
  );
}

export default function AiChatDrawer({
  open,
  onClose,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
  event.preventDefault();

  const trimmedMessage = message.trim();

  if (!trimmedMessage || loading) {
    return;
  }

  const nextMessages = [
    ...messages,
    {
      role: "user",
      text: trimmedMessage,
    },
  ];

  setMessages(nextMessages);
  setMessage("");
  setLoading(true);

  try {
    const data =
      await sendAiMessage(nextMessages);

    setMessages((current) => [
    ...current,
    {
        role: "assistant",
        text: data.response,
        media: data.media || [],
    },
    ]);
  } catch (error) {
    console.error(
      "Walter error:",
      error,
    );

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: "Something went wrong. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/50
          transition-opacity duration-300
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      <aside
        className={`
          fixed right-0 top-0 z-50
          h-dvh
          w-full
          max-w-xl
          border-l border-white/10
          bg-slate-950
          shadow-2xl
          transition-transform duration-300 ease-out
          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Walter 🤓
              </h2>

              <p className="text-sm text-white/50">
                Ask about movies, TV shows, games, and books
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Walter AI"
              className="
                rounded-lg
                p-2
                text-white/70
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <X size={22} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-white/40">
                Ask Walter for a recommendation.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((item, index) => (
                <div
                    key={index}
                    className={`
                    flex flex-col gap-3
                    ${
                        item.role === "user"
                        ? "ml-auto max-w-[85%]"
                        : "mr-auto w-full"
                    }
                    `}
                >
                    <div
                    className={`
                        whitespace-pre-wrap
                        rounded-xl
                        px-4 py-3
                        text-sm
                        ${
                        item.role === "user"
                            ? "bg-purple-600 text-white"
                            : "max-w-[85%] bg-white/10 text-white/90"
                        }
                    `}
                    >
                    {item.text}
                    </div>

                    {item.role === "assistant" &&
                    item.media?.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                        {item.media.map((media) => (
                            <ItemCard
                            key={`${media.type}-${media.id}`}
                            title={media.title}
                            imageSrc={getMediaImageUrl(
                                media,
                            )}
                            onOpen={() =>
                                navigate(
                                `/${media.type}/${media.id}`,
                                )
                            }
                            className="min-w-0 text-white"
                            />
                        ))}
                        </div>
                    )}
                </div>
                ))}

                {loading && (
                  <div className="mr-auto rounded-xl bg-white/10 px-4 py-3 text-sm text-white/50">
                    Walter is thinking...
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
                placeholder="Ask Walter..."
                disabled={loading}
                className="
                  flex-1
                  rounded-xl
                  border border-white/10
                  bg-white/5
                  px-4 py-3
                  text-white
                  placeholder:text-white/30
                  outline-none
                  focus:border-purple-500
                  disabled:opacity-50
                "
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !message.trim()
                }
                className="
                  rounded-xl
                  bg-purple-600
                  px-4
                  text-white
                  transition
                  hover:bg-purple-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
import {
  useEffect,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function getVisibleCount(
  slidesPerView,
  isMediumScreen,
) {
  if (typeof slidesPerView === "number") {
    return slidesPerView;
  }

  return isMediumScreen
    ? (
        slidesPerView.md ??
        slidesPerView.base ??
        1
      )
    : (slidesPerView.base ?? 1);
}

export default function Carousel({
  title,
  items,
  renderItem,
  getKey = (_, index) => index,
  slidesPerView = {
    base: 1,
    md: 3,
  },
  ariaLabel = title,
  className = "",
}) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [
    isMediumScreen,
    setIsMediumScreen,
  ] = useState(() =>
    window.matchMedia(
      "(min-width: 768px)",
    ).matches,
  );

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(min-width: 768px)",
      );

    const updateScreenSize = (event) =>
      setIsMediumScreen(
        event.matches,
      );

    mediaQuery.addEventListener(
      "change",
      updateScreenSize,
    );

    return () =>
      mediaQuery.removeEventListener(
        "change",
        updateScreenSize,
      );
  }, []);

  const visibleCount =
    getVisibleCount(
      slidesPerView,
      isMediumScreen,
    );

  const lastIndex = Math.max(
    items.length - visibleCount,
    0,
  );

  const safeIndex = Math.min(
    activeIndex,
    lastIndex,
  );

  const canNavigate =
    items.length > visibleCount;

  const gap = 16;

  const itemWidth = `calc((100% - ${
    (visibleCount - 1) * gap
  }px) / ${visibleCount})`;

  function previous() {
    setActiveIndex(
      safeIndex <= 0
        ? lastIndex
        : safeIndex - 1,
    );
  }

  function next() {
    setActiveIndex(
      safeIndex >= lastIndex
        ? 0
        : safeIndex + 1,
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section
      className={className}
      aria-label={ariaLabel}
    >
      {title && (
        <h2 className="mb-4 text-2xl font-bold">
          {title}
        </h2>
      )}

      <div className="relative">
        {canNavigate && (
          <button
            type="button"
            onClick={previous}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 transition hover:bg-black/80"
            aria-label={`Previous ${ariaLabel}`}
          >
            <ChevronLeft
              aria-hidden="true"
            />
          </button>
        )}

        <div
          className={
            canNavigate
              ? "mx-10 overflow-hidden"
              : "overflow-hidden"
          }
        >
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${
                (safeIndex * 100) /
                visibleCount
              }% - ${
                (safeIndex * gap) /
                visibleCount
              }px))`,
            }}
          >
            {items.map(
              (item, index) => (
                <div
                  key={getKey(
                    item,
                    index,
                  )}
                  className="shrink-0"
                  style={{
                    width: itemWidth,
                  }}
                >
                  {renderItem(
                    item,
                    index,
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {canNavigate && (
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 transition hover:bg-black/80"
            aria-label={`Next ${ariaLabel}`}
          >
            <ChevronRight
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  );
}
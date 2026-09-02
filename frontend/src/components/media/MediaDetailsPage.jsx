import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../common/BackButton";
import Carousel from "../common/Carousel";
import PageShell from "../layout/PageShell";
import CastMemberCard from "./CastMemberCard";
import MediaDetailsHero from "./MediaDetailsHero";
import MediaScreenshotCard from "./MediaScreenshotCard";
import { Save } from "lucide-react";

export default function MediaDetailsPage({ config }) {
  const { externalId } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [libraryEntry, setLibraryEntry] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [credits, setCredits] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { getImageUrl } = config;
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [mediaData, statusData, images, creditsData] = await Promise.all([
          config.api.getDetails(externalId),
          config.api.getStatus(externalId),
          config.api.getImages(externalId),
          config.api.getCredits
            ? config.api.getCredits(externalId)
            : Promise.resolve(null),
        ]);

        if (!isCurrent) return;

        setMedia(mediaData);
        setLibraryEntry(statusData);
        setNotes(statusData?.notes || "");
        setScreenshots(images.backdrops?.slice(0, 5) || []);
        setCredits(creditsData);
      } catch {
        if (isCurrent) setError(config.labels.notFound);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, [config, externalId]);

  async function toggleStatus(newStatus) {
    if (libraryEntry?.status === newStatus) {
      await config.api.remove(libraryEntry.id);
    } else if (libraryEntry) {
      await config.api.update(libraryEntry.id, {
        status: newStatus,
        isFavorite: libraryEntry.isFavorite,
      });
    } else {
      await config.api.add(config.createEntry(media, newStatus));
    }

    setLibraryEntry(await config.api.getStatus(externalId));
  }

  async function saveNotes() {
  if (!libraryEntry) {
    return;
  }

  try {
    setSavingNotes(true);

    const updatedEntry =
      await config.api.update(
        libraryEntry.id,
        {
          notes,
        },
      );

    setLibraryEntry(
      updatedEntry,
    );
  } catch (error) {
    console.error(
      "Failed to save notes:",
      error,
    );
  } finally {
    setSavingNotes(false);
  }
}

  if (loading) {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center">
        <p className="text-lg text-white/70">{config.labels.loading}</p>
      </PageShell>
    );
  }

  if (error || !media) {
    return (
      <PageShell contentClassName="p-6 text-center text-red-400">
        {error || config.labels.notFound}
      </PageShell>
    );
  }

  const title = config.getTitle(media);
  const cast = config.getCast
    ? config.getCast(credits).slice(0, 15)
    : [];

  return (
    <PageShell
      backgroundImage={getImageUrl(media.backdrop_path, "original")}
      contentClassName="mx-auto max-w-6xl p-4 sm:p-6"
    >
      <BackButton onClick={() => navigate(-1)} className="mb-6" />

      <MediaDetailsHero
        title={title}
        posterPath={media.poster_path}
        overview={media.overview}
        metadata={config.getMetadata(media, credits)}
        status={libraryEntry?.status}
        statusUi={config.statusUi}
        onToggleStatus={toggleStatus}
        getImageUrl={getImageUrl}
        watchedIcon={config.watchedIcon}
      />

      {libraryEntry?.status === "watched" && (
        <div className="mt-6 max-w-2xl">
          <h2 className="mb-2 text-lg font-semibold">
            My Notes
          </h2>

          <div className="flex items-end gap-2">
            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Write your thoughts about this..."
              rows={5}
              className="
                w-full
                resize-y
                rounded-xl
                border border-white/10
                bg-white/5
                p-4
                text-white
                placeholder:text-white/30
                outline-none
                transition
                focus:border-purple-500
              "
            />
            <button
              type="button"
              onClick={saveNotes}
              disabled={savingNotes}
              aria-label="Save notes"
              title="Save notes"
              className="
                flex
                h-[42px]
                w-[42px]
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-purple-600
                text-white
                transition
                hover:bg-purple-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save
                size={18}
                className={
                  savingNotes
                    ? "animate-pulse"
                    : ""
                }
              />
            </button>
          </div>
        </div>
      )}

      <Carousel
        title="Screenshots"
        items={screenshots}
        getKey={(screenshot, index) => screenshot.file_path || index}
        renderItem={(screenshot) => (
          <MediaScreenshotCard screenshot={screenshot} title={title} getImageUrl={getImageUrl}/>
        )}
        slidesPerView={{ base: 1, md: 3 }}
        className="mt-10"
      />

      {config.getCast && (
        <Carousel
          title="Cast"
          items={cast}
          getKey={(actor, index) => actor.id || index}
          renderItem={(actor) => <CastMemberCard actor={actor} />}
          slidesPerView={{ base: 2, md: 5 }}
          className="mt-10"
        />
      )}
    </PageShell>
  );
}

import PageHeader from "../components/common/PageHeader";
import PageShell from "../components/layout/PageShell";

export default function TVShows() {
  return (
    <PageShell contentClassName="p-6">
      <PageHeader title="My TV Shows" className="mb-6" />

      <p className="text-white/60">
        TV shows support is coming soon.
      </p>
    </PageShell>
  );
}
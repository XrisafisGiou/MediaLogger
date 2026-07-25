export default function StatGrid({ items, className = "" }) {
  return (
    <dl className={`grid grid-cols-1 gap-4 sm:grid-cols-3 ${className}`}>
      {items.map((item) => (
        <div key={item.key} className="rounded-lg bg-white/10 p-4 text-center">
          <dd className="text-2xl font-bold">{item.value}</dd>
          <dt className="text-white/60">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

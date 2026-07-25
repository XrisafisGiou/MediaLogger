export default function PageHeader({ title, children, className = "" }) {
  return (
    <header
      className={`flex items-center justify-between gap-4 ${className}`}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      {children && <div className="flex gap-3">{children}</div>}
    </header>
  );
}

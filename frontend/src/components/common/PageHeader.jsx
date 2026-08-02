export default function PageHeader({ title, children, className = "" }) {
  return (
    <header
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${className}`}
    >
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>

      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
          {children}
        </div>
      )}
    </header>
  );
}
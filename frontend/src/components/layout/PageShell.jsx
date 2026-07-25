export default function PageShell({
  children,
  backgroundImage,
  contentClassName = "",
  className = "",
}) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black text-white ${className}`}
    >
      {backgroundImage && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
        </>
      )}

      <main className={`relative z-10 ${contentClassName}`}>{children}</main>
    </div>
  );
}

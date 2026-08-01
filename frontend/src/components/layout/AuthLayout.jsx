import background from "../../assets/bg_image.png";

export default function AuthLayout({ children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      <div className="fixed left-1/2 top-50 z-10 flex -translate-x-1/2 items-center gap-3">
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          className="h-11 w-11 shrink-0"
        />

        <span className="text-2xl font-bold text-purple-400">
          MediaLogger
        </span>
      </div>

      <div className="relative z-10 w-80">
      {children}
    </div>
    </main>
  );
}

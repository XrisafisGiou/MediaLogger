import background from "../../assets/backgroundLandscape.png";
import backgroundPortrait from "../../assets/backgroundPortrait.png";

export default function AuthLayout({ children }) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat sm:block"
        style={{
          backgroundImage: `url(${background})`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{
          backgroundImage: `url(${backgroundPortrait})`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-sm flex-col items-center gap-5">
          <div className="flex items-center gap-2">
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

          <div className="w-full">{children}</div>
        </div>
      </div>
    </main>
  );
}
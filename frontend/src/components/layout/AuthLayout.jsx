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
      <div className="relative z-10 w-80">{children}</div>
    </main>
  );
}

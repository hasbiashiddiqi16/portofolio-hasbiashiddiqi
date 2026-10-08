import { ChevronDown } from "lucide-react";
import { useContent } from "../cms/ContentContext";

export default function Hero() {
  const { content } = useContent();
  const { hero } = content;

  return (
    <section
      id="top"
      className="noise relative flex min-h-screen flex-col justify-center overflow-hidden px-6"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-brown/20 blur-[120px]" />
        <div
          className="drift absolute -right-32 bottom-10 h-[26rem] w-[26rem] rounded-full bg-brown-soft/10 blur-[110px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ece3d7 1px, transparent 1px), linear-gradient(to bottom, #ece3d7 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="hero-in flex items-center gap-3" style={{ animationDelay: "100ms" }}>
          <span className="h-px w-10 bg-brown" />
          <span className="font-display text-xs uppercase tracking-[0.35em] text-brown-soft">
            {hero.eyebrow}
          </span>
        </div>

        <h1
          className="hero-in mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-sand sm:text-7xl md:text-8xl lg:text-[9rem]"
          style={{ animationDelay: "250ms" }}
        >
          {hero.titleFirst}
          <br />
          <span className="text-brown">{hero.titleAccent}</span>
        </h1>

        <p
          className="hero-in mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          style={{ animationDelay: "450ms" }}
        >
          {hero.subtitle}
        </p>

        <div
          className="line-grow mt-12 h-px w-full max-w-md bg-gradient-to-r from-brown via-line to-transparent"
          style={{ animationDelay: "600ms" }}
        />
      </div>

      <a
        href="#about"
        aria-label="Scroll down"
        className="hero-in group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ animationDelay: "900ms" }}
      >
        <span className="font-display text-[11px] uppercase tracking-[0.35em] text-muted transition-colors group-hover:text-brown-soft">
          Scroll Down
        </span>
        <span className="relative flex h-12 w-7 justify-center rounded-full border border-muted/60 transition-colors group-hover:border-brown">
          <span className="scroll-dot mt-2 block h-2 w-1 rounded-full bg-brown-soft" />
        </span>
        <ChevronDown size={18} className="chevron-bob text-brown-soft" />
      </a>
    </section>
  );
}

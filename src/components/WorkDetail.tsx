import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import type { Work } from "../data/types";
import { workHref } from "../lib/router";
import Contact from "./Contact";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Reveal from "./Reveal";

function Paragraphs({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return <p className="text-muted">Deskripsi proyek belum ditambahkan.</p>;
  }

  return (
    <>
      {paragraphs.map((p, i) => (
        <Reveal key={i} delay={i * 100}>
          <p className="text-lg leading-relaxed text-sand/80 md:text-xl">{p}</p>
        </Reveal>
      ))}
    </>
  );
}

function PagerCard({
  work,
  direction,
}: {
  work: Work;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  return (
    <a
      href={workHref(work.slug)}
      className={`group flex flex-1 flex-col gap-3 rounded-3xl border border-line bg-surface/60 p-6 transition-colors duration-500 hover:border-brown/60 md:p-8 ${
        isNext ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] text-brown-soft">
        {isNext ? (
          <>
            Berikutnya
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
          </>
        ) : (
          <>
            <ArrowLeft size={14} className="transition-transform duration-500 group-hover:-translate-x-1" />
            Sebelumnya
          </>
        )}
      </span>
      <span className="font-display text-xl font-medium leading-snug text-sand transition-colors group-hover:text-brown-soft md:text-2xl">
        {work.title}
      </span>
    </a>
  );
}

function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-display text-xs uppercase tracking-[0.35em] text-brown-soft">404</span>
      <h1 className="font-display text-4xl font-semibold text-sand md:text-6xl">Proyek tidak ditemukan</h1>
      <p className="max-w-md text-muted">Proyek yang Anda cari mungkin sudah dihapus atau tautannya berubah.</p>
      <a
        href="#works"
        className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-sand transition-colors hover:border-brown hover:text-brown-soft"
      >
        <ArrowLeft size={16} />
        Kembali ke karya
      </a>
    </section>
  );
}

export default function WorkDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const { works } = content;

  const index = works.findIndex((w) => w.slug === slug);
  const work = index >= 0 ? works[index] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const total = works.length;
  const prev = total > 1 ? works[(index - 1 + total) % total] : undefined;
  const next = total > 1 ? works[(index + 1) % total] : undefined;

  return (
    <div className="min-h-screen bg-ink text-sand selection:bg-brown">
      <Navbar />

      <main>
        {!work ? (
          <div className="pt-32">
            <NotFound />
          </div>
        ) : (
          <>
            {/* Header */}
            <section className="noise relative overflow-hidden px-6 pb-16 pt-36 md:pt-44">
              <div className="pointer-events-none absolute inset-0">
                <div className="drift absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brown/20 blur-[120px]" />
                <div
                  className="drift absolute -right-32 top-40 h-[22rem] w-[22rem] rounded-full bg-brown-soft/10 blur-[110px]"
                  style={{ animationDelay: "-6s" }}
                />
              </div>

              <div className="relative mx-auto max-w-6xl">
                <a
                  href="#works"
                  className="hero-in group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brown-soft"
                >
                  <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" />
                  Kembali ke karya
                </a>

                <div className="hero-in mt-12 flex flex-wrap items-center gap-3" style={{ animationDelay: "100ms" }}>
                  <span className="h-px w-10 bg-brown" />
                  {work.category && (
                    <span className="font-display text-xs uppercase tracking-[0.35em] text-brown-soft">
                      {work.category}
                    </span>
                  )}
                  <span className="rounded-full border border-line px-3 py-1 font-display text-[11px] tracking-[0.2em] text-muted">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </div>

                <h1
                  className="hero-in mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-sand sm:text-6xl md:text-7xl lg:text-8xl"
                  style={{ animationDelay: "250ms" }}
                >
                  {work.title}
                </h1>

                {work.subtitle && (
                  <p
                    className="hero-in mt-6 max-w-2xl text-lg text-muted md:text-xl"
                    style={{ animationDelay: "400ms" }}
                  >
                    {work.subtitle}
                  </p>
                )}

                {work.liveUrl && (
                  <div className="hero-in mt-10" style={{ animationDelay: "550ms" }}>
                    <a
                      href={work.liveUrl}
                      rel="noopener noreferrer"
                      className="group inline-flex w-fit items-center gap-3 rounded-full bg-brown px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.15em] text-ink transition-all duration-500 hover:gap-5 hover:bg-brown-soft"
                    >
                      {work.liveLabel || "Lihat Proyek"}
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Cover */}
            {work.image && (
              <section className="px-6 pb-24">
                <div className="mx-auto max-w-6xl">
                  <Reveal variant="scale">
                    <div className="group relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-line bg-surface">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            {/* Description & details */}
            <section className="px-6 pb-32">
              <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
                <div className="flex flex-col gap-8">
                  <Reveal variant="left">
                    <span className="font-display text-xs uppercase tracking-[0.3em] text-brown-soft">
                      Tentang proyek
                    </span>
                  </Reveal>
                  <Paragraphs text={work.description} />
                </div>

                {work.details.length > 0 && (
                  <Reveal variant="right">
                    <aside className="h-fit rounded-3xl border border-line bg-surface/60 p-8">
                      <h3 className="mb-6 font-display text-sm uppercase tracking-[0.25em] text-brown-soft">
                        Detail Proyek
                      </h3>
                      <ul className="flex flex-col gap-4">
                        {work.details.map((item, i) => (
                          <li key={`${item}-${i}`} className="flex items-center gap-4">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brown/50 text-brown-soft">
                              <Check size={14} />
                            </span>
                            <span className="text-sand/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  </Reveal>
                )}
              </div>
            </section>

            {/* Gallery */}
            {work.gallery.length > 0 && (
              <section className="px-6 pb-32">
                <div className="mx-auto max-w-6xl">
                  <Reveal>
                    <span className="mb-10 block font-display text-xs uppercase tracking-[0.3em] text-brown-soft">
                      Galeri
                    </span>
                  </Reveal>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {work.gallery.map((src, i) => (
                      <Reveal key={`${src}-${i}`} delay={(i % 2) * 120}>
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface">
                          <img
                            src={src}
                            alt={`${work.title} - galeri ${i + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                          />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Prev / next */}
            {prev && next && (
              <section className="px-6 pb-32">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
                  <Reveal variant="left" className="flex flex-1">
                    <PagerCard work={prev} direction="prev" />
                  </Reveal>
                  <Reveal variant="right" className="flex flex-1">
                    <PagerCard work={next} direction="next" />
                  </Reveal>
                </div>
              </section>
            )}
          </>
        )}

        <Contact />
      </main>

      <Footer />
    </div>
  );
}

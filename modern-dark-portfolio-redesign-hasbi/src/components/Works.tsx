import { ArrowUpRight } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import type { Work } from "../data/types";
import { workHref } from "../lib/router";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function WorkCard({ work, index }: { work: Work; index: number }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <a
      href={workHref(work.slug)}
      aria-label={`Lihat proyek ${work.title}`}
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 group-hover:border-brown/60 group-hover:shadow-[0_24px_60px_-24px_rgba(184,130,90,0.45)]">
        {work.image && (
          <img
            src={work.image}
            alt={work.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[40%] transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:grayscale-0"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full border border-sand/15 bg-ink/50 px-3 py-1 font-display text-[11px] tracking-[0.2em] text-brown-soft backdrop-blur">
            {number}
          </span>

          <span className="flex items-center gap-1.5 rounded-full border border-brown/40 bg-ink/60 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.18em] text-brown-soft backdrop-blur transition-all duration-500 md:-translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            Buka
            <ArrowUpRight size={12} />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-lg font-medium leading-snug text-sand transition-transform duration-500 group-hover:-translate-y-1">
            {work.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-sand/80 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="h-px w-8 origin-left bg-brown transition-transform duration-700 md:scale-x-0 md:group-hover:scale-x-100" />
            <span className="font-display uppercase tracking-[0.2em]">Lihat proyek</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brown text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Works() {
  const { content } = useContent();
  const { sections, works } = content;

  return (
    <section id="works" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={sections.works.eyebrow} title={sections.works.title} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work, i) => (
            <Reveal key={work.id} delay={(i % 3) * 120}>
              <WorkCard work={work} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

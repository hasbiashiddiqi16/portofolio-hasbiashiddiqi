import { Sparkles } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  if (items.length === 0) return null;

  // Repeat the list enough times to fill wide screens, then duplicate the
  // whole block so the -50% translate loops seamlessly.
  const copies = Math.max(2, Math.ceil(6 / items.length));
  const half = Array.from({ length: copies }, () => items).flat();
  const loop = [...half, ...half];

  return (
    <div className="relative flex overflow-hidden py-3">
      <div
        className={`flex w-max shrink-0 items-center gap-6 pr-6 ${
          reverse ? "marquee-track marquee-reverse" : "marquee-track"
        }`}
      >
        {loop.map((item, i) => (
          <div key={`${item}-${i}`} className="flex shrink-0 items-center gap-6 whitespace-nowrap">
            <span className="font-display text-4xl font-medium tracking-tight text-sand/90 md:text-6xl">
              {item}
            </span>
            <Sparkles size={22} className="shrink-0 text-brown" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const { content } = useContent();
  const { sections, services } = content;

  return (
    <section id="services" className="relative overflow-hidden py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow={sections.services.eyebrow} title={sections.services.title} />
      </div>

      <Reveal>
        <div className="flex flex-col gap-2 border-y border-line py-6">
          <MarqueeRow items={services.rowOne} />
          <MarqueeRow items={services.rowTwo} reverse />
        </div>
      </Reveal>

      {/* Edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </section>
  );
}

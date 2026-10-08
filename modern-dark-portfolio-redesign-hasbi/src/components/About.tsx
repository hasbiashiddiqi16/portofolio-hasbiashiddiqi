import { useEffect, useState } from "react";
import { Briefcase, Phone, Rocket, User, Users } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import { toTelHref } from "../data/content";
import { useInView } from "../hooks/useInView";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function CountUp({ to, duration = 1600 }: { to: number; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{value}</span>;
}

const experienceIcons = [Briefcase, Users, Rocket];

function ExperienceLabel({ text }: { text: string }) {
  const match = text.match(/^(\d+)(\+?)\s*(.*)$/);
  if (match) {
    return (
      <>
        <CountUp to={Number(match[1])} />
        {match[2]} {match[3]}
      </>
    );
  }
  return <>{text}</>;
}

export default function About() {
  const { content } = useContent();
  const { sections, about, information, experience } = content;

  return (
    <section id="about" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={sections.about.eyebrow} title={sections.about.title} />

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-10">
            <Reveal variant="left">
              <p className="text-lg leading-relaxed text-sand/80 md:text-xl">{about.intro}</p>
            </Reveal>

            {about.image && (
              <Reveal variant="left" delay={150}>
                <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line bg-surface">
                  <img
                    src={about.image}
                    alt={information.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                </div>
              </Reveal>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <Reveal variant="right">
              <div className="rounded-3xl border border-line bg-surface/60 p-8">
                <h3 className="mb-6 font-display text-sm uppercase tracking-[0.25em] text-brown-soft">
                  Information
                </h3>
                <ul className="flex flex-col gap-5">
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-brown-soft">
                      <User size={18} />
                    </span>
                    <span className="text-lg text-sand">{information.name}</span>
                  </li>
                  <li>
                    <a href={toTelHref(information.phone)} className="group flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-brown-soft transition-colors group-hover:border-brown">
                        <Phone size={18} />
                      </span>
                      <span className="text-lg text-sand transition-colors group-hover:text-brown-soft">
                        {information.phone}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal variant="right" delay={150}>
              <div className="rounded-3xl border border-line bg-surface/60 p-8">
                <h3 className="mb-6 font-display text-sm uppercase tracking-[0.25em] text-brown-soft">
                  Experience &amp; Support
                </h3>
                <ul className="grid gap-5 sm:grid-cols-1">
                  {experience.map((item, i) => {
                    const Icon = experienceIcons[i] ?? Rocket;
                    return (
                      <li key={`${item}-${i}`} className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-brown-soft">
                          <Icon size={18} />
                        </span>
                        <span className="font-display text-lg text-sand">
                          <ExperienceLabel text={item} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

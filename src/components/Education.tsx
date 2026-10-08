import { GraduationCap } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Education() {
  const { content } = useContent();
  const { sections, education } = content;

  return (
    <section id="education" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={sections.education.eyebrow} title={sections.education.title} />

        <div className="grid gap-12 md:grid-cols-2 md:gap-x-16">
          {education.map((item, i) => (
            <Reveal key={item.id} delay={(i % 2) * 150 + Math.floor(i / 2) * 150}>
              <div className="group relative border-l border-line pl-8 md:pl-10">
                <span className="absolute -left-[4px] top-2 flex h-[9px] w-[9px] rounded-full bg-brown ring-4 ring-ink transition-transform duration-500 group-hover:scale-150" />
                <div className="mb-3 flex items-center gap-3 text-brown-soft">
                  <GraduationCap size={18} className="opacity-70" />
                  <h3 className="font-display text-sm uppercase tracking-[0.25em]">{item.heading}</h3>
                </div>
                <p className="font-display text-2xl font-medium leading-snug text-sand transition-colors group-hover:text-brown-soft md:text-3xl">
                  {item.subtitle}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

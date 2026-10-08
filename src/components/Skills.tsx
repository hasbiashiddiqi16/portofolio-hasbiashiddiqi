import { useContent } from "../cms/ContentContext";
import type { Skill } from "../data/content";
import { useInView } from "../hooks/useInView";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="group">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-sand/90 transition-colors group-hover:text-brown-soft">
          {skill.name}
        </span>
        <span className="font-display text-sm tabular-nums text-brown-soft">{skill.value}%</span>
      </div>
      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-line">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brown to-brown-soft"
          style={{
            width: inView ? `${skill.value}%` : "0%",
            transition: `width 1.4s cubic-bezier(0.22, 1, 0.36, 1) ${index * 120}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { content } = useContent();
  const { sections, skillGroups } = content;

  return (
    <section id="skills" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={sections.skills.eyebrow} title={sections.skills.title} />

        <div className="grid gap-8 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.id} delay={gi * 150}>
              <div className="h-full rounded-3xl border border-line bg-surface/60 p-8 transition-colors duration-500 hover:border-brown/60 md:p-10">
                <h3 className="mb-10 font-display text-2xl font-semibold text-sand">{group.title}</h3>
                <div className="flex flex-col gap-7">
                  {group.items.map((skill, i) => (
                    <SkillBar key={`${skill.name}-${i}`} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

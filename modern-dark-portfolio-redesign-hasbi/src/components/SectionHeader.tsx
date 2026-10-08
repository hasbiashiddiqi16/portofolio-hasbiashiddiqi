import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
};

export default function SectionHeader({ eyebrow, title, align = "left" }: Props) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`mb-14 flex flex-col gap-4 md:mb-20 ${alignClass}`}>
      <Reveal>
        <span className="inline-flex items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-brown-soft">
          <span className="h-px w-8 bg-brown" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-sand md:text-6xl">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}

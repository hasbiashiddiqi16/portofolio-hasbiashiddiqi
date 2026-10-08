import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import { buildWhatsappLink } from "../data/content";
import Reveal from "./Reveal";

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const whatsappLink = buildWhatsappLink(content);

  return (
    <section id="contact" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-10 md:p-16">
          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brown/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-brown-soft/10 blur-[90px]" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-8">
              <Reveal>
                <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-sand md:text-6xl">
                  {contact.headline} <span className="text-brown">{contact.headlineAccent}</span>
                </h2>
              </Reveal>

              <Reveal delay={120}>
                <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">{contact.body}</p>
              </Reveal>

              <Reveal delay={240}>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-brown px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.15em] text-ink transition-all duration-500 hover:gap-5 hover:bg-brown-soft"
                >
                  <MessageCircle size={18} />
                  WhatsApp Me
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
              </Reveal>
            </div>

            <Reveal variant="scale" delay={200} className="flex justify-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat via WhatsApp"
                className="group relative flex h-56 w-56 items-center justify-center md:h-72 md:w-72"
              >
                <span className="ping-ring absolute inset-0 rounded-full border border-brown/60" />
                <span
                  className="ping-ring absolute inset-0 rounded-full border border-brown/40"
                  style={{ animationDelay: "1.1s" }}
                />
                <span className="absolute inset-6 rounded-full border border-line transition-colors duration-500 group-hover:border-brown" />
                <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brown to-brown-soft text-ink shadow-[0_0_60px_-10px_rgba(184,130,90,0.6)] transition-transform duration-500 group-hover:scale-105 md:h-36 md:w-36">
                  <MessageCircle size={44} strokeWidth={1.6} />
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

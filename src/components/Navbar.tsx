import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(max > 0 ? y / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-line" : "bg-transparent"
      }`}
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] origin-left bg-gradient-to-r from-brown via-brown-soft to-brown"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-sand transition-colors hover:text-brown-soft"
        >
          Hasbi<span className="text-brown">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm text-muted transition-colors hover:text-sand"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brown transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line p-2 text-sand transition-colors hover:border-brown md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={`glass overflow-hidden border-line transition-all duration-500 md:hidden ${
          open ? "max-h-96 border-b opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-line/60 last:border-0">
              <a
                href={link.href}
                onClick={close}
                className="block py-3 text-base text-sand transition-colors hover:text-brown-soft"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

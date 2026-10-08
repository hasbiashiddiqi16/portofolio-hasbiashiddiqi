import { useEffect } from "react";
import AdminApp from "./admin/AdminApp";
import { useContent } from "./cms/ContentContext";
import About from "./components/About";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import Skills from "./components/Skills";
import WorkDetail from "./components/WorkDetail";
import Works from "./components/Works";
import { useHash } from "./hooks/useHash";
import { parseRoute } from "./lib/router";

function HomePage() {
  return (
    <div className="min-h-screen bg-ink text-sand selection:bg-brown">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Education />
        <Services />
        <Contact />
        <Works />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const route = parseRoute(hash);
  const { content, loaded } = useContent();

  // Judul & deskripsi SEO mengikuti halaman yang sedang tampil.
  const routeName = route.name;
  const routeSlug = route.name === "work" ? route.slug : "";

  useEffect(() => {
    const work = routeName === "work" ? content.works.find((w) => w.slug === routeSlug) : undefined;
    document.title = work ? `${work.title} | ${content.site.name}` : content.site.title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", content.site.description);
  }, [routeName, routeSlug, content.works, content.site.title, content.site.description, content.site.name]);

  // Navigasi antar halaman: anchor di halaman utama di-scroll, detail mulai dari atas.
  useEffect(() => {
    if (route.name === "home" && route.anchor) {
      document.getElementById(route.anchor)?.scrollIntoView({ behavior: "smooth" });
    } else if (route.name === "work") {
      window.scrollTo({ top: 0 });
    }
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loaded) return <div className="min-h-screen bg-ink" />;

  switch (route.name) {
    case "admin":
      return <AdminApp />;
    case "work":
      return <WorkDetail slug={route.slug} />;
    default:
      return <HomePage />;
  }
}

export type SectionLabel = { eyebrow: string; title: string };
export type Skill = { name: string; value: number };
export type SkillGroup = { id: string; title: string; items: Skill[] };
export type EducationItem = { id: string; heading: string; subtitle: string };

export type Work = {
  id: string;
  /** Dipakai di URL: #/work/<slug> */
  slug: string;
  /** Judul kartu & halaman detail */
  title: string;
  /** Kategori kecil di atas judul detail, contoh: "Website" */
  category: string;
  /** Subjudul detail, contoh: "Lotte Mart Channel" */
  subtitle: string;
  /** Gambar sampul (kartu & hero detail) */
  image: string;
  /** Galeri tambahan di halaman detail */
  gallery: string[];
  /** Paragraf deskripsi; pisahkan paragraf dengan baris kosong */
  description: string;
  /** Poin-poin detail proyek */
  details: string[];
  /** Link eksternal opsional (live / demo) */
  liveUrl: string;
  /** Label tombol link eksternal, contoh: "Live Now" atau "Demo" */
  liveLabel: string;
};

export type Content = {
  site: { title: string; description: string; name: string };
  hero: { eyebrow: string; titleFirst: string; titleAccent: string; subtitle: string };
  sections: {
    about: SectionLabel;
    skills: SectionLabel;
    education: SectionLabel;
    services: SectionLabel;
    works: SectionLabel;
  };
  about: { intro: string; image: string };
  information: { name: string; phone: string };
  experience: string[];
  skillGroups: SkillGroup[];
  education: EducationItem[];
  services: { rowOne: string[]; rowTwo: string[] };
  contact: {
    headline: string;
    headlineAccent: string;
    body: string;
    whatsappNumber: string;
    whatsappMessage: string;
  };
  works: Work[];
};

export type NavLink = { label: string; href: string };

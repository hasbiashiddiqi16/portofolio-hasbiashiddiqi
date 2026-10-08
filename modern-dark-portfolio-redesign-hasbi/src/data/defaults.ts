import type { Content, NavLink, Work } from "./types";

export const SITE_URL = "https://portofolio-hasbiashiddiqi.netlify.app";
export const ASSET_BASE = `${SITE_URL}/assets/img/`;

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
  { label: "Works", href: "#works" },
];

const ABOUT_INTRO =
  "Hi, nice to see you! welcome to my portofolio, i made this InsyAllah nothing less and nothing more if there is excess then it is from Allah, and lastly i like a brown things and beautiful things.";

const CONTACT_BODY =
  "I hone skills by myself, when I work or hone skills anytime and anywhere, especially at night where people sleep and I just do activities. I am a person who works fast, thoroughness at the end.";

const WEB_DETAILS = [
  "Responsive",
  "Picture Slide",
  "Linked All Apps",
  "Hosting, Domain",
  "Exclusive Design",
  "New Experience",
  "Modern Style",
];

const DESIGN_DETAILS = ["Exclusive Design", "New Experience", "Modern Style", "Get All Files"];

const UIUX_DETAILS = [
  "Mobile",
  "Picture Slide",
  "Linked All Apps",
  "Prototype",
  "Exclusive Design",
  "New Experience",
  "Modern Style",
  "Pluged In",
];

type WorkSeed = Pick<
  Work,
  "id" | "slug" | "title" | "category" | "subtitle" | "image" | "details" | "liveUrl" | "liveLabel"
>;

const withDefaults = (seed: WorkSeed): Work => ({
  ...seed,
  gallery: [],
  description: ABOUT_INTRO,
});

const SEEDS: WorkSeed[] = [
  {
    id: "w1",
    slug: "lotte-kiosk",
    title: "Lotte KIOSK",
    category: "Website",
    subtitle: "Lotte Mart Channel",
    image: `${ASSET_BASE}lotte-kiosk.jpg`,
    details: WEB_DETAILS,
    liveUrl: "https://www.figma.com/design/3QruzkmPJ5QkVzETgtAffe/Online-Order-Microsite?node-id=64-1940&t=HIlXRPaBnkiAqqmo-1",
    liveLabel: "Live Now",
  },
  {
    id: "w2",
    slug: "lotte-microsite-web",
    title: "Lotte Microsite Web",
    category: "Website",
    subtitle: "Groceries",
    image: `${ASSET_BASE}lotte-microsite-web.jpg`,
    details: WEB_DETAILS,
    liveUrl: "https://order.lottemart.co.id/corp",
    liveLabel: "Live Now",
  },
  {
    id: "w3",
    slug: "hustle-creative",
    title: "Hustle Creative Website",
    category: "Website",
    subtitle: "Agency",
    image: `${ASSET_BASE}hustle-creative.jpg`,
    details: WEB_DETAILS,
    liveUrl: "https://hustlecreative.id/",
    liveLabel: "Live Now",
  },
  {
    id: "w4",
    slug: "teras-rumah",
    title: "Teras Rumah Website",
    category: "Website",
    subtitle: "Coffee Shop",
    image: `${ASSET_BASE}teras-rumah.jpg`,
    details: WEB_DETAILS,
    liveUrl: "https://terasrmh.com/",
    liveLabel: "Live Now",
  },
  {
    id: "w5",
    slug: "ui-ux-mnc",
    title: "UI/UX MNC Fintech",
    category: "UI/UX Design & Prototype",
    subtitle: "MNC Group Fintech Product",
    image: `${ASSET_BASE}ui-ux-mnc.jpg`,
    details: WEB_DETAILS,
    liveUrl: "https://xd.adobe.com/view/4030082c-0554-40b1-9c27-a63bc5d97618-1563/",
    liveLabel: "Demo",
  },
  {
    id: "w6",
    slug: "ui-ux-insurance",
    title: "UI/UX Sahabat Insurance",
    category: "UI/UX Design & Prototype",
    subtitle: "Sahabat Insurance",
    image: `${ASSET_BASE}ui-ux-insurance.jpg`,
    details: WEB_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
  {
    id: "w7",
    slug: "apicoco",
    title: "Coconut Shell Briquette",
    category: "Website",
    subtitle: "Best Producers of Coconut Shell Briquette",
    image: `${ASSET_BASE}apicoco.jpg`,
    details: WEB_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
  {
    id: "w8",
    slug: "travelution",
    title: "Travelution",
    category: "Website",
    subtitle: "Penjualan Tiket",
    image: `${ASSET_BASE}travelution.jpg`,
    details: WEB_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
  {
    id: "w9",
    slug: "suzuki",
    title: "Suzuki App",
    category: "Website",
    subtitle: "Task For Recruitment",
    image: `${ASSET_BASE}suzuki.jpg`,
    details: WEB_DETAILS,
    liveUrl: "https://antigrvty-suzuki-hyperlocal-2-0.netlify.app/outlet-xl7.html",
    liveLabel: "Demo",
  },
  {
    id: "w10",
    slug: "work-5",
    title: "UI/UX Design",
    category: "UI/UX Design",
    subtitle: "Plant Shop",
    image: `${ASSET_BASE}work5.jpg`,
    details: UIUX_DETAILS,
    liveUrl: "https://xd.adobe.com/view/23f90779-b5c9-4dd9-91cb-579f9af74a5d-76aa/",
    liveLabel: "Demo",
  },
  {
    id: "w11",
    slug: "work-6",
    title: "UI/UX Design",
    category: "UI/UX Design",
    subtitle: "Injek Pedal App",
    image: `${ASSET_BASE}work6.jpg`,
    details: UIUX_DETAILS,
    liveUrl: "https://xd.adobe.com/view/1d0779d6-f469-4b73-8a30-2f3ecb78466e-4854/",
    liveLabel: "Demo",
  },
  {
    id: "w12",
    slug: "work-7",
    title: "Logo Design",
    category: "Graphic Design",
    subtitle: "Logo Corporate",
    image: `${ASSET_BASE}work7.jpg`,
    details: DESIGN_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
  {
    id: "w13",
    slug: "work-8",
    title: "Logo Design",
    category: "Graphic Design",
    subtitle: "Coffee Shop Logo",
    image: `${ASSET_BASE}work8.jpg`,
    details: DESIGN_DETAILS,
    liveUrl: "https://www.instagram.com/terasrmh/",
    liveLabel: "Live Now",
  },
  {
    id: "w14",
    slug: "work-9",
    title: "T-Shirt Design",
    category: "Graphic Design",
    subtitle: "T-Shirt Design",
    image: `${ASSET_BASE}work9.jpg`,
    details: DESIGN_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
  {
    id: "w15",
    slug: "work-10",
    title: "T-Shirt Design",
    category: "Graphic Design",
    subtitle: "T-Shirt Design",
    image: `${ASSET_BASE}work10.jpg`,
    details: DESIGN_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
  {
    id: "w16",
    slug: "denkulo",
    title: "Logo Pisang Goreng Madu Den Kulo",
    category: "Design Illustration",
    subtitle: "Logo Pisang Goreng Madu Den Kulo",
    image: `${ASSET_BASE}logo-denkulo.jpg`,
    details: DESIGN_DETAILS,
    liveUrl: "https://www.instagram.com/masradenpgm/",
    liveLabel: "Live Now",
  },
  {
    id: "w17",
    slug: "alexa-beauty",
    title: "Logo Alexa Beauty And Fashion",
    category: "Design Illustration",
    subtitle: "Logo Alexa Beauty And Fashion",
    image: `${ASSET_BASE}work15.png`,
    details: DESIGN_DETAILS,
    liveUrl: "",
    liveLabel: "",
  },
];

export const DEFAULT_CONTENT: Content = {
  site: {
    title: "Portofolio | Hasbi Ashiddiqi",
    description: "Portofolio Hasbi Ashiddiqi - Flutter Front End, UI/UX, Logo & Graphic Design.",
    name: "Hasbi Ashiddiqi",
  },
  hero: {
    eyebrow: "Portofolio",
    titleFirst: "Hasbi",
    titleAccent: "Ashiddiqi",
    subtitle: "Flutter Front End, UI/UX, Logo & Graphic Design, serta Video Editing.",
  },
  sections: {
    about: { eyebrow: "My intro", title: "About Me" },
    skills: { eyebrow: "Why Choose Me", title: "My Expertise Area" },
    education: { eyebrow: "Qualification", title: "My Education" },
    services: { eyebrow: "What I Offer", title: "My Services" },
    works: { eyebrow: "My Portofolio", title: "Recent Works" },
  },
  about: {
    intro: ABOUT_INTRO,
    image: `${ASSET_BASE}about.png`,
  },
  information: {
    name: "Hasbi Ashiddiqi",
    phone: "0812-8735-0024",
  },
  experience: ["Many Years Works", "Many Years Freelances", "50+ Projects"],
  skillGroups: [
    {
      id: "frontend",
      title: "Frontend & Software",
      items: [
        { name: "Flutter Front End", value: 90 },
        { name: "Adobe Illustration", value: 75 },
        { name: "Adobe Photoshop", value: 90 },
        { name: "Figma", value: 90 },
      ],
    },
    {
      id: "design",
      title: "Design",
      items: [
        { name: "UI/UX", value: 95 },
        { name: "Logo", value: 85 },
        { name: "Graphic", value: 85 },
        { name: "Video Editing + Gif", value: 90 },
      ],
    },
  ],
  education: [
    { id: "edu1", heading: "2006 - 2013", subtitle: "Islamic Teacher Training College" },
    { id: "edu2", heading: "Pondok Modern Darussalam Gontor", subtitle: "Islamic Religion" },
    { id: "edu3", heading: "2015 - 2020", subtitle: "Esa Unggul University" },
    { id: "edu4", heading: "Bachelor", subtitle: "Information Technology" },
  ],
  services: {
    rowOne: ["Flutter Front End", "Adobe Illustration", "Adobe Photoshop", "Figma"],
    rowTwo: ["UI/UX", "Logo", "Graphic", "Video Editing + Gif"],
  },
  contact: {
    headline: "Do You Have a New Project",
    headlineAccent: "With Me?",
    body: CONTACT_BODY,
    whatsappNumber: "6281287350024",
    whatsappMessage: "Hi Hasbi, saya mau berkolaborasi dengan anda",
  },
  works: SEEDS.map(withDefaults),
};

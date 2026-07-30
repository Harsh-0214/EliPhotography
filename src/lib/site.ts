export const site = {
  name: "Elish Modi",
  tagline: "Photography",
  url: "https://elishmodi.com",
  description:
    "Natural-light portrait, family and newborn photography by Elish Modi. Sessions by appointment.",

  /* TODO(client): replace the three values below with the real ones. */
  email: "hello@elishmodi.com",
  phone: "+1 (000) 000-0000",
  location: "Available for travel",

  /* TODO(client): replace hrefs with the real profile URLs. */
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
  ],
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Rates", href: "#rates" },
  { label: "Work", href: "#work" },
] as const;

export type Service = {
  /** Also the value submitted by the booking form's shoot-type field. */
  slug: string;
  name: string;
  price: string;
  /** Shown under the price when the price needs qualifying. */
  priceNote?: string;
  meta: string[];
};

export const services: Service[] = [
  {
    slug: "baby",
    name: "Baby Photos",
    price: "$120",
    meta: ["Newborn to 12 months", "90 minutes", "20+ edited images"],
  },
  {
    slug: "family",
    name: "Family Photos",
    price: "$60",
    priceNote: "per guest",
    meta: ["Any group size", "90 minutes", "Outdoors or at home"],
  },
  {
    slug: "portraits",
    name: "Individual Portraits",
    price: "$120",
    meta: ["Headshots and personal work", "60 minutes", "Studio or location"],
  },
  {
    slug: "children",
    name: "Child Photos",
    price: "$60",
    priceNote: "per guest",
    meta: ["Ages one and up", "60 minutes", "Play-led, unposed"],
  },
  {
    slug: "vehicles",
    name: "Vehicle Photography",
    price: "$60",
    meta: ["Cars and motorcycles", "60 minutes", "Golden hour or garage"],
  },
  {
    slug: "landscape",
    name: "Landscape Photography",
    price: "Inquire",
    priceNote: "quoted per project",
    meta: ["Commissions and prints", "Scope and travel priced together"],
  },
];

/** Gallery filters. `slug` doubles as the folder / filename prefix. */
export const categories = [
  { slug: "baby", label: "Baby" },
  { slug: "family", label: "Family" },
  { slug: "portraits", label: "Portraits" },
  { slug: "children", label: "Children" },
  { slug: "vehicles", label: "Vehicles" },
  { slug: "landscape", label: "Landscape" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

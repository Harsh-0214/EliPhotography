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

/**
 * The gallery chapters, in the order they appear down the page. `slug`
 * doubles as the folder name under /public/images/gallery and as the
 * filename prefix, and it is the anchor each chapter scrolls to.
 *
 * A chapter with no photographs is skipped entirely rather than shown empty.
 */
export const categories = [
  {
    slug: "baby",
    label: "Baby",
    blurb: "Newborn to the first birthday.",
    detail:
      "Sessions run at home in the first weeks, or in studio once they are sitting up. We work around feeds and naps — there is no schedule to keep.",
    cta: "Book a baby session",
  },
  {
    slug: "children",
    label: "Children",
    blurb: "Ages one and up. Play-led, never posed.",
    detail:
      "No countdowns and no “say cheese”. We follow whatever they are already doing, which is why the pictures come out looking like them.",
    cta: "Book a children’s session",
  },
  {
    slug: "family",
    label: "Family",
    blurb: "Parents, children, and the moments in between.",
    detail:
      "Everyone in one frame first, then the ones that matter more — the in-between moments while you are all simply together.",
    cta: "Book a family session",
  },
  {
    slug: "portraits",
    label: "Portraits",
    blurb: "One person, on location, doing what they do.",
    detail:
      "An hour on location, doing the thing you actually do. Musicians play, makers make. It shows in the face.",
    cta: "Book a portrait session",
  },
  {
    slug: "vehicles",
    label: "Vehicles",
    blurb: "Cars and motorcycles, in the light they deserve.",
    detail:
      "Golden hour or a clean garage. Cars and bikes photographed like portraits, with attention to line, paint and reflection.",
    cta: "Book a vehicle shoot",
  },
  {
    slug: "landscape",
    label: "Landscape",
    blurb: "Places, quietly.",
    detail:
      "Commissioned work and prints from a growing archive of Scotland and the coast. Tell me the wall and I will tell you the frame.",
    cta: "Enquire about a commission",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

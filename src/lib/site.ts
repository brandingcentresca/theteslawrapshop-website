// Central business / content configuration for The Tesla Wrap Shop.
// Editing copy? This is the single source of truth for static content.

export const site = {
  name: "The Tesla Wrap Shop",
  shortName: "Tesla Wrap Shop",
  domain: "theteslawrapshop.com",
  url: "https://theteslawrapshop.com",
  description:
    "Premium 3M & Avery vinyl wraps for every Tesla model. Full colour changes, custom prints and decals in Toronto and across the GTA.",
  tagline: "Premium quality 3M & Avery vinyl wraps for all Tesla models",
  phone: "647-559-5939",
  phoneHref: "tel:6475595939",
  email: "info@TheTeslaWrapShop.com",
  emailHref: "mailto:info@TheTeslaWrapShop.com",
  whatsapp: "16475337223",
  whatsappHref:
    "https://api.whatsapp.com/send/?phone=16475337223&text=Hi,%20I%27m%20looking%20for%20a%20quote",
  mapsHref: "https://goo.gl/maps/uqcczAaJDWYGhEzL9",
  serviceAreas: [
    "Toronto",
    "Etobicoke",
    "Mississauga",
    "Scarborough",
    "Brampton",
  ],
  credit: {
    label: "Designed & Developed by Branding Centres",
    href: "https://brandingcentres.com",
  },
} as const;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
] as const;

export const teslaModels = [
  "Model 3",
  "Model Y",
  "Model S",
  "Model X",
  "Cybertruck",
  "Roadster",
] as const;

export const pricing = [
  {
    name: "Standard Colour Change",
    original: 4500,
    price: 2800,
    description: "Any 3M or Avery manufactured colour.",
    popular: true,
  },
  {
    name: "Custom Printed Colours",
    original: 5700,
    price: 4500,
    description: "Any custom printed colour of your choice.",
    popular: false,
  },
  {
    name: "Custom Printed Design",
    original: 5995,
    price: 4750,
    description: "Any custom printed design of your choice.",
    popular: false,
  },
] as const;

export const services = [
  {
    title: "Tesla Colour Changes",
    description:
      "Completely change the look of your Tesla with a premium finish and colour that turns heads.",
    icon: "SprayCan",
  },
  {
    title: "Tesla Decals",
    description:
      "Show off your unique style with our custom-designed decals, accents and racing stripes.",
    icon: "Sticker",
  },
  {
    title: "Paint Protection & Finish",
    description:
      "Protect your factory paint and lock in a flawless finish with premium vinyl film.",
    icon: "ShieldCheck",
  },
] as const;

export const whyUs = [
  {
    title: "Premium Quality Vinyl",
    description:
      "We never compromise on quality — we wrap exclusively with premium vinyl from 3M and Avery Dennison.",
    icon: "BadgeCheck",
  },
  {
    title: "Attention to Detail",
    description:
      "Every job is done with your satisfaction as the goal. Our experienced installers sweat every little detail.",
    icon: "Search",
  },
  {
    title: "Secure Storage",
    description:
      "Your Tesla is kept in our fully insured installation garage, secured with alarms and cameras until pickup.",
    icon: "Lock",
  },
] as const;

export const process = [
  {
    step: 1,
    title: "Consultation",
    description:
      "We start by walking you through all the available options and gathering your requirements — your vision, ideas and any brand information. We offer advice and answer every question about the process and materials.",
  },
  {
    step: 2,
    title: "Design & Proofing",
    description:
      "We design your wrap and send a mockup to review against your vision. We refine and re-present until the design is exactly what you want and you approve it.",
  },
  {
    step: 3,
    title: "File Setup & Print",
    description:
      "Once approved, we set up our industry-grade vinyl printers and print your design with accurate colours and detail on premium 3M and Avery Dennison film.",
  },
  {
    step: 4,
    title: "Installation",
    description:
      "We prepare and thoroughly clean the vehicle to remove any dust or debris, then our installers wrap your Tesla with meticulous attention to the details that matter.",
  },
] as const;

export const materials = [
  {
    name: "Avery Dennison",
    description:
      "A versatile, high-quality material known for exceptional durability, vibrant colours and a wide range of finishes — a preferred choice for premium vehicle wraps.",
  },
  {
    name: "3M",
    description:
      "Trusted worldwide, 3M vinyl offers top-notch quality, exceptional adhesive properties and long-lasting durability for stunning results.",
  },
  {
    name: "Hexis",
    description:
      "A premium vinyl known for its durability, conformability and ease of application across a wide range of vehicle wrap projects.",
  },
] as const;

export const faqs = [
  {
    question: "How much does it cost to wrap a Tesla?",
    answer:
      "Like any vehicle wrap, the cost depends on the design, material and installation complexity. It can range anywhere from $650 to $5,000+. Give us a call at 647-559-5939 with your requirements and we'll give you an accurate price.",
  },
  {
    question: "How long will it take to wrap my Tesla?",
    answer:
      "Depending on the type of wrap and its complexity, it can take anywhere from 1 to 7 days. We work as quickly as possible without ever compromising on quality.",
  },
  {
    question: "What type of vinyl will you use?",
    answer:
      "We only use premium vinyl from 3M and Avery Dennison. We believe in quality and customer satisfaction, so compromising on material isn't something we do.",
  },
  {
    question: "Where will you park my Tesla while wrapping?",
    answer:
      "Your vehicle is stored in our installation garage, which is fully insured and secured with alarms and cameras. We keep your Tesla safe until you pick it up.",
  },
  {
    question: "Can I provide my own material?",
    answer:
      "Absolutely — as long as the material is from Avery Dennison, 3M or Hexis, we'll happily install it for you.",
  },
] as const;

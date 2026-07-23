export const business = {
  name: "Kindr",
  email: "janethorwell@gmail.com",
  calendlyUrl: "https://calendly.com/janethorwell/45min-matrescence-practitioner-session",
};

export const navLinks = [
  { href: "/#what-is-matrescence", label: "Matrescence" },
  { href: "/#janet", label: "Meet Janet" },
  { href: "/#packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
] as const;

export const whyCards = [
  {
    title: "Continuity of Care",
    icon: "heart",
    text: "Your midwife has left, and you don't feel like yourself. A Matrescence Practitioner helps you navigate this enormous transformation, supporting you right when you need it, so you can focus on bonding with your baby and adjusting to this new phase.",
  },
  {
    title: "Evidence & Nurture",
    icon: "sparkle",
    text: "Evidence-based practice with lived experience, woven together. You're guided by someone who understands matrescence deeply, and can meet you where you are at, with reliable information at the right time. No information overload, or well-meaning conflicting advice.",
  },
  {
    title: "Understand Matrescence",
    icon: "grateful-hands",
    text: "Once you can name what you're going through, you can move through it. Understand the disorienting shift you are experiencing and the internal and external environments at play, to find your own path in matrescence. One that feels right for you.",
  },
] as const;

type IconName = "person" | "plus" | "circle";

export type Package = {
  title: string;
  icon: IconName;
  description: string;
  price: string;
  suffix?: string;
  action: string;
  pricingNote?: string;
  href?: string;
  variant: "outline" | "primary" | "modal";
  popular?: boolean;
};

const slidingScalePricing = "I want this service to be accessible, so please reach out if you'd like to access my sliding scale pricing.";

export const packages: readonly Package[] = [
  {
    title: "Single Session",
    icon: "person",
    description: "1:1 Matrescence Practitioner coaching, 50 minutes. A space to land, debrief, and find clarity on whatever's surfacing this week.",
    price: "$120",
    suffix: "/ session",
    action: "Book this session",
    pricingNote: slidingScalePricing,
    href: "#janet",
    variant: "outline",
  },
  {
    title: "Coaching Journey",
    icon: "plus",
    description: "6 sessions of 1:1 Matrescence Practitioner coaching. Ongoing, continuous care to walk alongside you through matrescence.",
    price: "$650",
    suffix: "for 6 sessions",
    action: "Start the journey",
    pricingNote: slidingScalePricing,
    href: "#janet",
    variant: "primary",
    popular: true,
  },
  {
    title: "Matrescence Circles",
    icon: "circle",
    description: "Small group circles with other mothers navigating matrescence alongside you. Shared stories and a shared understanding.",
    price: "Coming soon",
    action: "Join the waitlist",
    variant: "modal",
  },
];

export const bioParagraphs = [
  "I care deeply about changing how mothers experience their path into motherhood. I crashed into motherhood after years in corporate tech and leadership, where my life revolved around achievement and working with many teams of people in a single day.",
  "Overnight, I moved into a world where I sat with my baby in my arms, stuck on the couch learning to breastfeed. It was suddenly hard to measure my achievements each day.",
  "Somewhere along the way, I'd overlooked a different kind of leadership, one that we rarely acknowledge or celebrate. I was learning that nurturing, presence and connection are some of the hardest and most sacred work we ever do.",
  "Since then, I've redesigned my life for more flexible work, leant into my creativity and I've surrounded myself with women who lead in a different way.",
  "I bring my lived experience and my creativity to this Matrescence Practitioner role, and I'd love to work with you to find your own path in motherhood, one that aligns with your values and the life you'd like to build.",
] as const;

export const crisisSupport = [
  {
    label: "Free mental health helpline",
    text: "1737, free call or text (24 hours a day, 7 days a week)",
  },
  {
    label: "Healthline",
    text: "0800 611 116 (24 hours a day, 7 days a week)",
  },
  {
    label: "If it is an emergency",
    text: "please dial 111 or go to your local emergency department.",
  },
] as const;

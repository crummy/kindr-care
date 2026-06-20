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

export const availabilitySlots = ["Wed 10:00am", "Thu 10:00am", "Thu 12:00pm"] as const;

export const whyCards = [
  {
    title: "Continuity of Care",
    icon: "heart",
    text: "Your midwife has left, and you don't feel like yourself yet. A Matrescence Practitioner helps you navigate this enormous transformation, connecting in right when you need support.",
  },
  {
    title: "Evidence & Nurture",
    icon: "sparkle",
    text: "Evidence-based practice with lived experience, woven together. You're guided by someone who understands matrescence deeply, and can meet you where you are at, without the overwhelm.",
  },
  {
    title: "Understand Matrescence",
    icon: "grateful-hands",
    text: "Once you can name what you're going through, you can move through it. Understand the psychological shift into motherhood, and find a path within it that's actually yours.",
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
  href?: string;
  variant: "outline" | "primary" | "modal";
  popular?: boolean;
};

export const packages: readonly Package[] = [
  {
    title: "Single Session",
    icon: "person",
    description: "1:1 Matrescence Practitioner coaching, 45 minutes. A space to land, debrief, and find clarity on whatever's surfacing this week.",
    price: "From $80",
    suffix: "/ session",
    action: "Book this session",
    href: "#janet",
    variant: "outline",
  },
  {
    title: "Coaching Journey",
    icon: "plus",
    description: "6 sessions of 1:1 Matrescence Practitioner coaching. Ongoing, continuous care to walk alongside you through matrescence.",
    price: "From $420",
    suffix: "for 6 sessions",
    action: "Start the journey",
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
  "I care deeply about changing how mothers experience their path into motherhood. I crashed into motherhood after years in corporate tech and leadership, where my life revolved around achievement, working with teams of a hundred people in a single day.",
  "Overnight, I moved into a world where I sat alone with my baby in my arms, stuck on the couch learning to breastfeed, and it was suddenly hard to measure my achievements each day. Somewhere along the way I'd forgotten that raising a human, nurturing them, and sitting in presence with them is one of the most sacred jobs a person can do.",
  "I've spent the years since reconnecting with my values and my creativity, relearning the art of nurture, learning how to hold space, and surrounding myself with women who lead in a different way - a kinder way.",
  "I bring my lived experience and my creativity to this Matrescence Practitioner role, and I'd love to work with you to find your own path in motherhood, one that aligns with your values.",
] as const;

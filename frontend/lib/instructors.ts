export type InstructorCategory = "Tech" | "Design" | "Business" | "Marketing";

export interface Instructor {
  id: number;
  slug: string;
  name: string;
  role: string;
  company: string;
  category: InstructorCategory;
  bio: string;
  rating: number;
  reviewCount: string;
  students: string;
  courseCount: number;
  initials: string;
  color: string;
  image?: string;
}

export const instructors: Instructor[] = [
  {
    id: 1,
    slug: "sarah-chen",
    name: "Sarah Chen",
    role: "SENIOR SOFTWARE ENGINEER",
    company: "Stripe",
    category: "Tech",
    bio: "Specialising in full-stack systems and API design, Sarah has led engineering teams at Stripe and Vercel, building infrastructure used by millions of developers. Her courses focus on production patterns over toy examples.",
    rating: 4.9,
    reviewCount: "1.2k",
    students: "40,000+",
    courseCount: 2,
    initials: "SC",
    color: "bg-blue-500",
  },
  {
    id: 2,
    slug: "marcus-johnson",
    name: "Dr. Marcus Johnson",
    role: "HEAD OF DATA SCIENCE",
    company: "TechCorp",
    category: "Tech",
    bio: "Marcus is a veteran data scientist with over 15 years of experience in predictive analytics and AI. He has authored three best-selling textbooks and has mentored over 50,000 students globally.",
    rating: 4.8,
    reviewCount: "2.4k",
    students: "50,000+",
    courseCount: 1,
    initials: "MJ",
    color: "bg-violet-500",
  },
  {
    id: 3,
    slug: "priya-patel",
    name: "Priya Patel",
    role: "SENIOR PRODUCT DESIGNER",
    company: "Airbnb",
    category: "Design",
    bio: "Priya has led design for features used by millions at Airbnb and Spotify. She speaks regularly at UX conferences and focuses her teaching on real-world design decisions over pixel-pushing exercises.",
    rating: 4.9,
    reviewCount: "980",
    students: "21,000+",
    courseCount: 3,
    initials: "PP",
    color: "bg-rose-500",
  },
  {
    id: 4,
    slug: "james-osei",
    name: "James Osei",
    role: "SOFTWARE ENGINEER & EDUCATOR",
    company: "Fintech Startup",
    category: "Tech",
    bio: "James has been teaching programming since 2017, with a relentless focus on making technical concepts genuinely accessible. He's helped over 60,000 beginners write their first programs and currently engineers at a fintech startup in London.",
    rating: 4.7,
    reviewCount: "4.1k",
    students: "60,000+",
    courseCount: 1,
    initials: "JO",
    color: "bg-emerald-500",
  },
  {
    id: 5,
    slug: "amara-diallo",
    name: "Amara Diallo",
    role: "VP GROWTH",
    company: "Series B SaaS",
    category: "Marketing",
    bio: "Amara has led growth at three venture-backed companies, taking one from $1M to $20M ARR in 18 months. She teaches the frameworks she wishes she'd had earlier — practical, data-driven, and free of hype.",
    rating: 4.6,
    reviewCount: "2.3k",
    students: "16,000+",
    courseCount: 1,
    initials: "AD",
    color: "bg-orange-500",
  },
  {
    id: 6,
    slug: "liam-okonkwo",
    name: "Liam Okonkwo",
    role: "STAFF INFRASTRUCTURE ENGINEER",
    company: "Cloudflare",
    category: "Tech",
    bio: "Liam has spent 12 years building and operating large-scale distributed systems at Cloudflare and previously at AWS itself. He holds multiple AWS certifications and has presented at KubeCon Europe and NA.",
    rating: 4.8,
    reviewCount: "1.6k",
    students: "11,000+",
    courseCount: 1,
    initials: "LO",
    color: "bg-slate-600",
  },
];

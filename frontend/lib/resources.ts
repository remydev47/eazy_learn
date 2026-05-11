export type ResourceType = "E-book" | "Article" | "Template" | "Tool";
export type ResourceCategory = "All" | "Web Dev" | "Data Science" | "Design" | "Programming" | "Marketing";

export interface Resource {
  id: number;
  type: ResourceType;
  title: string;
  description: string;
  meta: string;
  image: string;
  category: Exclude<ResourceCategory, "All">;
  downloadLabel: string;
}

export const resources: Resource[] = [
  {
    id: 1,
    type: "E-book",
    title: "The Complete Guide to Full-Stack Development",
    description:
      "From frontend basics to backend architecture — a structured roadmap for building production-grade applications with React and Node.js.",
    meta: "128 pages",
    image: "/assets/less2.webp",
    category: "Web Dev",
    downloadLabel: "Download Free",
  },
  {
    id: 2,
    type: "E-book",
    title: "Introduction to Machine Learning with Python",
    description:
      "Core ML concepts, algorithms, and practical exercises using scikit-learn, Pandas, and real-world datasets. No PhD required.",
    meta: "94 pages",
    image: "/assets/less3.webp",
    category: "Data Science",
    downloadLabel: "Download Free",
  },
  {
    id: 3,
    type: "Article",
    title: "UX Research Methods: Which One to Use and When",
    description:
      "A decision framework for choosing between user interviews, surveys, usability tests, and card sorting — matched to your project stage.",
    meta: "12 min read",
    image: "/assets/less4.webp",
    category: "Design",
    downloadLabel: "Read Now",
  },
  {
    id: 4,
    type: "Template",
    title: "CSS Grid & Flexbox Reference Sheet",
    description:
      "A print-ready cheat sheet covering every CSS Grid and Flexbox property with visual diagrams and copy-paste snippets.",
    meta: "Free download",
    image: "/assets/less5.avif",
    category: "Web Dev",
    downloadLabel: "Download Free",
  },
  {
    id: 5,
    type: "Tool",
    title: "Python Data Analysis Starter Kit",
    description:
      "Pre-configured Jupyter notebooks, sample datasets, and a requirements.txt so you can go from zero to analysis in under five minutes.",
    meta: "Free download",
    image: "/assets/less6.avif",
    category: "Data Science",
    downloadLabel: "Download Free",
  },
  {
    id: 6,
    type: "Article",
    title: "Growth Marketing Metrics That Actually Matter",
    description:
      "Cut through vanity metrics to the signals that indicate real product-market fit and sustainable user growth.",
    meta: "8 min read",
    image: "/assets/less7.avif",
    category: "Marketing",
    downloadLabel: "Read Now",
  },
  {
    id: 7,
    type: "E-book",
    title: "System Design Interview Preparation Guide",
    description:
      "Frameworks, patterns, and 20 practice questions covering scalability, databases, caching, and distributed systems design.",
    meta: "76 pages",
    image: "/assets/less8.avif",
    category: "Programming",
    downloadLabel: "Download Free",
  },
  {
    id: 8,
    type: "Template",
    title: "Figma Component Library Starter",
    description:
      "A production-ready Figma kit with buttons, forms, cards, modals, and navigation — built on an 8pt grid with auto-layout throughout.",
    meta: "Free download",
    image: "/assets/less9.webp",
    category: "Design",
    downloadLabel: "Download Free",
  },
  {
    id: 9,
    type: "Article",
    title: "DevOps Tooling in 2025: The Definitive Comparison",
    description:
      "An opinionated comparison of CI/CD platforms, container orchestration tools, and observability stacks for teams of all sizes.",
    meta: "15 min read",
    image: "/assets/less10.webp",
    category: "Programming",
    downloadLabel: "Read Now",
  },
];

// Placeholder content for the Demos page — EDIT THESE.
// Add a `youtubeId` to a demo to embed the real video; without one, a placeholder tile shows.

export interface DemoVideo {
  id: string;
  title: string;
  description: string;
  youtubeId?: string; // e.g. the part after ?v= in a YouTube URL
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMins: number;
}

export const DEMO_VIDEOS: DemoVideo[] = [
  { id: "d1", title: "Platform Walkthrough", description: "A quick tour of KodeClass — signing up, choosing a tier, and joining your first live class." },
  { id: "d2", title: "Inside a Live Cohort Session", description: "See how our instructor-led live classes run, with recordings available afterwards." },
  { id: "d3", title: "Student Success Story", description: "How a beginner went from zero to a first developer role through KodeClass." },
];

export const BLOG_POSTS: BlogPost[] = [
  { id: "b1", title: "Why live cohorts beat pre-recorded courses", excerpt: "Accountability, real feedback, and a community that keeps you going — the case for learning live.", date: "2026-07-15", readMins: 4 },
  { id: "b2", title: "The Kenyan tech job market in 2026", excerpt: "Which skills are actually in demand, and how to position yourself to get hired.", date: "2026-07-08", readMins: 6 },
  { id: "b3", title: "From beginner to job-ready in 6 months", excerpt: "A realistic roadmap through our Beginner, Intermediate, and Advanced tiers.", date: "2026-06-30", readMins: 5 },
];

// Placeholder events — EDIT THESE (or wire to a CMS/Moodle calendar later).
// `type: "class"` links to the course's live room (/live/[courseSlug]); enrolled only.
// `type: "webinar"` is an open marketing session with its own Jitsi room (joinRoom).

export interface KcEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string; // ISO 8601, e.g. "2026-08-05T18:00:00+03:00"
  durationMins: number;
  type: "webinar" | "class";
  courseSlug?: string; // for type "class"
  joinRoom?: string; // for type "webinar" — a Jitsi room name
  host?: string;
}

export const EVENTS: KcEvent[] = [
  {
    id: "webinar-career-in-tech",
    title: "Free Webinar: Launching Your Career in Tech",
    description: "An open session on how to break into software, cloud, and AI roles in Kenya — and how KodeClass bootcamps get you there.",
    startsAt: "2026-08-05T18:00:00+03:00",
    durationMins: 60,
    type: "webinar",
    joinRoom: "KodeClass-Webinar-CareerInTech",
    host: "KodeClass Team",
  },
  {
    id: "webinar-ai-ml-intro",
    title: "Free Webinar: Getting Started with Generative AI",
    description: "A taster of our Generative AI & Machine Learning track — live demos and Q&A.",
    startsAt: "2026-08-12T18:00:00+03:00",
    durationMins: 60,
    type: "webinar",
    joinRoom: "KodeClass-Webinar-GenAI",
    host: "KodeClass Team",
  },
  {
    id: "class-web-dev-cohort",
    title: "Live Class: Introduction to Web Development",
    description: "Weekly live cohort session. Enrolled Beginner-tier students only.",
    startsAt: "2026-08-06T19:00:00+03:00",
    durationMins: 90,
    type: "class",
    courseSlug: "intro-web-development",
    host: "Instructor",
  },
];

export function upcomingEvents(nowIso: string): KcEvent[] {
  const now = new Date(nowIso).getTime();
  return EVENTS.filter((e) => new Date(e.startsAt).getTime() + e.durationMins * 60000 >= now).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

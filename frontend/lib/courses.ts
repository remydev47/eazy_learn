export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Lesson {
  title: string;
  duration: string;
  type: "video" | "quiz";
  current?: boolean;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  whatYouLearn: string[];
  instructor: {
    name: string;
    title: string;
    initials: string;
    color: string;
    bio: string;
  };
  category: string;
  level: Level;
  rating: number;
  reviewCount: number;
  studentCount: string;
  duration: string;
  totalLessons: number;
  price: number;
  originalPrice: number;
  image: string;
  curriculum: Module[];
  moodleId?: number;
}

export const courses: CourseData[] = [
  {
    id: 1,
    slug: "fullstack-react-nodejs",
    title: "Full-Stack Web Development with React & Node.js",
    shortDescription:
      "Go from zero to a deployable full-stack application. Build a production-grade project using React, Node.js, Express, and PostgreSQL.",
    overview:
      "This course takes you from the fundamentals of web development all the way to deploying a production-ready application. You'll understand how the frontend and backend fit together, write clean REST APIs, manage authentication securely, and ship code that actually works in the real world. Each module ends with a project milestone — by the end you'll have a portfolio-ready application.",
    whatYouLearn: [
      "Build REST APIs with Node.js & Express",
      "Manage state with React Query & Context API",
      "Implement JWT authentication end-to-end",
      "Design and query a PostgreSQL database",
      "Write and run integration tests with Vitest",
      "Deploy to a VPS using Docker & Nginx",
    ],
    instructor: {
      name: "Sarah Chen",
      title: "Senior Software Engineer, Stripe",
      initials: "SC",
      color: "bg-blue-500",
      bio: "Sarah is a full-stack engineer with 10 years at companies including Stripe, Vercel, and early-stage startups. She's built payment infrastructure at scale and taught over 40,000 students across multiple platforms. Her courses focus on production patterns rather than toy examples.",
    },
    category: "Web Dev",
    level: "Intermediate",
    rating: 4.9,
    reviewCount: 3240,
    studentCount: "18k+",
    duration: "42 hours",
    totalLessons: 68,
    price: 199,
    originalPrice: 349,
    image: "/assets/less2.webp",
    curriculum: [
      {
        title: "Web Fundamentals & Project Setup",
        lessons: [
          { title: "How the web works (request/response cycle)", duration: "12:40", type: "video" },
          { title: "Setting up your development environment", duration: "18:05", type: "video" },
          { title: "Project architecture walkthrough", duration: "09:55", type: "video" },
        ],
      },
      {
        title: "Node.js & Express Backend",
        lessons: [
          { title: "Node.js module system & async patterns", duration: "22:10", type: "video" },
          { title: "Building your first Express router", duration: "19:30", type: "video" },
          { title: "Middleware, error handling & logging", duration: "16:45", type: "video" },
          { title: "Connecting to PostgreSQL with pg", duration: "21:20", type: "video" },
          { title: "Quiz: Express & REST Concepts", duration: "5 Questions", type: "quiz" },
        ],
      },
      {
        title: "React Frontend Mastery",
        lessons: [
          { title: "Component architecture & prop drilling", duration: "20:15", type: "video", current: true },
          { title: "React Query for server state", duration: "24:40", type: "video" },
          { title: "Forms with React Hook Form + Zod", duration: "18:55", type: "video" },
          { title: "Routing with Next.js App Router", duration: "22:30", type: "video" },
        ],
      },
      {
        title: "Authentication & Security",
        lessons: [
          { title: "JWT access & refresh token strategy", duration: "26:10", type: "video" },
          { title: "Password hashing with bcrypt", duration: "11:05", type: "video" },
          { title: "Protecting routes on client and server", duration: "17:35", type: "video" },
          { title: "Quiz: Security Best Practices", duration: "8 Questions", type: "quiz" },
        ],
      },
      {
        title: "Deployment & DevOps Basics",
        lessons: [
          { title: "Dockerising your application", duration: "28:20", type: "video" },
          { title: "Nginx reverse proxy & SSL with Let's Encrypt", duration: "19:50", type: "video" },
          { title: "CI/CD with GitHub Actions", duration: "23:15", type: "video" },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "data-science-python",
    title: "Data Science & Machine Learning with Python",
    shortDescription:
      "Master the full data science lifecycle — from raw data to boardroom-ready insights. Covers Pandas, Matplotlib, scikit-learn, and SQL.",
    overview:
      "This comprehensive program is designed to take you from a curious beginner to a data-literate professional. We bypass the fluff and focus on the technical rigours required in modern tech environments. You will learn to navigate the entire data lifecycle, from messy raw data ingestion to polished visualizations.",
    whatYouLearn: [
      "Data cleaning and wrangling with Pandas",
      "Statistical inference and hypothesis testing",
      "Advanced visualisation with Matplotlib & Seaborn",
      "Machine learning pipeline construction",
      "SQL for complex database querying",
      "Deployment of predictive models",
    ],
    instructor: {
      name: "Dr. Marcus Johnson",
      title: "Head of Data Science, TechCorp",
      initials: "MJ",
      color: "bg-violet-500",
      bio: "Marcus is a veteran data scientist with over 15 years of experience in predictive analytics and artificial intelligence. He has authored three best-selling textbooks on statistical learning and has mentored over 50,000 students globally.",
    },
    category: "Data Science",
    level: "Intermediate",
    rating: 4.8,
    reviewCount: 2180,
    studentCount: "22k+",
    duration: "38 hours",
    totalLessons: 54,
    price: 199,
    originalPrice: 299,
    image: "/assets/less3.webp",
    curriculum: [
      {
        title: "Introduction to Data Science",
        lessons: [
          { title: "What is data science — roles and tools", duration: "14:20", type: "video" },
          { title: "Setting up Python with Jupyter and Anaconda", duration: "16:40", type: "video" },
          { title: "NumPy essentials", duration: "21:05", type: "video" },
        ],
      },
      {
        title: "Data Wrangling",
        lessons: [
          { title: "Loading and inspecting datasets with Pandas", duration: "18:35", type: "video" },
          { title: "Handling missing values and duplicates", duration: "22:10", type: "video" },
          { title: "Merging, grouping and reshaping data", duration: "25:00", type: "video" },
          { title: "Quiz: Pandas Operations", duration: "6 Questions", type: "quiz" },
        ],
      },
      {
        title: "Machine Learning Fundamentals",
        lessons: [
          { title: "Supervised vs Unsupervised Learning", duration: "15:42", type: "video", current: true },
          { title: "Linear Regression Deep Dive", duration: "24:10", type: "video" },
          { title: "Gradient Descent Explained", duration: "12:55", type: "video" },
          { title: "Quiz: Algorithm Selection", duration: "5 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "ux-design-fundamentals",
    title: "UI/UX Design: From Research to High-Fidelity Prototypes",
    shortDescription:
      "Learn the complete design process — user research, wireframing, Figma prototyping, and design systems — used at top tech companies.",
    overview:
      "This course walks you through the exact process professional UX designers use at companies like Google, Airbnb and Figma. You'll learn to validate ideas before writing a line of code, build wireframes that communicate intent, and create high-fidelity prototypes that stakeholders can actually interact with.",
    whatYouLearn: [
      "Conduct user interviews and synthesise findings",
      "Create user personas and journey maps",
      "Build wireframes in Figma from scratch",
      "Apply visual hierarchy and typography principles",
      "Design and test interactive prototypes",
      "Hand off designs to engineers with proper specs",
    ],
    instructor: {
      name: "Priya Patel",
      title: "Senior Product Designer, Airbnb",
      initials: "PP",
      color: "bg-rose-500",
      bio: "Priya is a product designer with 8 years at Airbnb and Spotify. She's led design for features used by millions and speaks regularly at UX conferences. Her teaching style focuses on real-world decisions rather than pixel-pushing exercises.",
    },
    category: "Design",
    level: "Beginner",
    rating: 4.9,
    reviewCount: 1760,
    studentCount: "14k+",
    duration: "28 hours",
    totalLessons: 42,
    price: 149,
    originalPrice: 249,
    image: "/assets/less4.webp",
    curriculum: [
      {
        title: "Design Thinking & Research",
        lessons: [
          { title: "The double diamond framework", duration: "11:30", type: "video" },
          { title: "Running user interviews", duration: "19:45", type: "video" },
          { title: "Building user personas", duration: "14:20", type: "video" },
        ],
      },
      {
        title: "Wireframing & Information Architecture",
        lessons: [
          { title: "Low-fidelity wireframes with pen & paper", duration: "12:00", type: "video" },
          { title: "Figma basics: frames, components, constraints", duration: "28:15", type: "video" },
          { title: "Designing navigation and IA", duration: "20:30", type: "video" },
        ],
      },
      {
        title: "High-Fidelity Design & Prototyping",
        lessons: [
          { title: "Colour theory and accessible palettes", duration: "17:40", type: "video", current: true },
          { title: "Typography systems", duration: "15:55", type: "video" },
          { title: "Building interactive prototypes", duration: "24:10", type: "video" },
          { title: "Quiz: Design Principles", duration: "7 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "python-for-beginners",
    title: "Python for Beginners: Write Your First Programs",
    shortDescription:
      "The most beginner-friendly Python course available. No prior experience needed. Write real programs by the end of day one.",
    overview:
      "Python is the world's most popular first programming language — and for good reason. This course strips away every intimidating concept and teaches you exactly what you need to start writing real scripts, automate tasks, and understand how software thinks.",
    whatYouLearn: [
      "Understand variables, loops and conditionals",
      "Write reusable functions and modules",
      "Work with files, APIs and JSON data",
      "Build a command-line app from scratch",
      "Understand object-oriented programming basics",
      "Use pip and virtual environments correctly",
    ],
    instructor: {
      name: "James Osei",
      title: "Software Engineer & Educator",
      initials: "JO",
      color: "bg-emerald-500",
      bio: "James has been teaching programming since 2017, with a focus on making technical concepts genuinely accessible. He's helped over 60,000 beginners write their first programs and currently works as an engineer at a fintech startup in London.",
    },
    category: "Programming",
    level: "Beginner",
    rating: 4.7,
    reviewCount: 4100,
    studentCount: "31k+",
    duration: "24 hours",
    totalLessons: 38,
    price: 129,
    originalPrice: 199,
    image: "/assets/less5.avif",
    curriculum: [
      {
        title: "Getting Started with Python",
        lessons: [
          { title: "Installing Python and VS Code", duration: "10:15", type: "video" },
          { title: "Your first script: variables and print()", duration: "14:30", type: "video" },
          { title: "Data types: strings, numbers, booleans", duration: "18:45", type: "video" },
        ],
      },
      {
        title: "Control Flow & Functions",
        lessons: [
          { title: "If/else statements", duration: "16:20", type: "video" },
          { title: "For and while loops", duration: "21:10", type: "video" },
          { title: "Writing and calling functions", duration: "19:35", type: "video", current: true },
          { title: "Quiz: Python Basics", duration: "10 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "advanced-react-patterns",
    title: "Advanced React Patterns & Architecture",
    shortDescription:
      "For developers who already know React and want to write the kind of code that scales. Performance, patterns, and architecture.",
    overview:
      "This is not a beginner React course. We assume you're comfortable with hooks and component basics. What we teach here is how to design systems that are maintainable at scale — the patterns used by teams at Meta, Vercel, and Linear.",
    whatYouLearn: [
      "Compound components and render props",
      "Custom hook design patterns",
      "Performance optimisation with useMemo & useCallback",
      "State management architecture decisions",
      "React Server Components in depth",
      "Testing strategy for complex component trees",
    ],
    instructor: {
      name: "Sarah Chen",
      title: "Senior Software Engineer, Stripe",
      initials: "SC",
      color: "bg-blue-500",
      bio: "Sarah is a full-stack engineer with 10 years at companies including Stripe and Vercel. She's built payment infrastructure at scale and taught over 40,000 students across multiple platforms.",
    },
    category: "Web Dev",
    level: "Advanced",
    rating: 4.8,
    reviewCount: 1820,
    studentCount: "9k+",
    duration: "32 hours",
    totalLessons: 48,
    price: 179,
    originalPrice: 299,
    image: "/assets/less6.avif",
    curriculum: [
      {
        title: "Architectural Patterns",
        lessons: [
          { title: "Compound components pattern", duration: "24:30", type: "video" },
          { title: "Render props vs hooks", duration: "19:15", type: "video" },
          { title: "Inversion of control in UI", duration: "22:40", type: "video" },
        ],
      },
      {
        title: "Performance Deep Dive",
        lessons: [
          { title: "Profiling with React DevTools", duration: "18:20", type: "video", current: true },
          { title: "When (not) to memoize", duration: "21:00", type: "video" },
          { title: "Virtualization for long lists", duration: "16:45", type: "video" },
          { title: "Quiz: Performance Patterns", duration: "6 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "figma-to-code",
    title: "Figma to Code: Building Responsive Interfaces",
    shortDescription:
      "Bridge the gap between design and engineering. Turn Figma designs into pixel-perfect, responsive HTML and CSS.",
    overview:
      "Designers and developers often talk past each other. This course teaches you to speak both languages. You'll take real Figma designs and implement them precisely in HTML, CSS, and Tailwind — understanding exactly how design specs translate to code.",
    whatYouLearn: [
      "Read and interpret Figma design specs",
      "Build responsive layouts with CSS Grid and Flexbox",
      "Implement design tokens with CSS variables",
      "Use Tailwind CSS to match designs precisely",
      "Handle spacing, typography and colour systems in code",
      "Collaborate with designers using Figma's Dev Mode",
    ],
    instructor: {
      name: "Priya Patel",
      title: "Senior Product Designer, Airbnb",
      initials: "PP",
      color: "bg-rose-500",
      bio: "Priya is a product designer with 8 years at Airbnb and Spotify. Her deep knowledge of both design and frontend makes her uniquely qualified to teach this bridge course.",
    },
    category: "Design",
    level: "Intermediate",
    rating: 4.9,
    reviewCount: 987,
    studentCount: "7k+",
    duration: "18 hours",
    totalLessons: 30,
    price: 119,
    originalPrice: 189,
    image: "/assets/less7.avif",
    curriculum: [
      {
        title: "Reading Figma Specs",
        lessons: [
          { title: "Navigating a Figma file as a developer", duration: "12:10", type: "video" },
          { title: "Extracting colours, fonts and spacing", duration: "15:35", type: "video" },
          { title: "Understanding auto layout", duration: "18:00", type: "video" },
        ],
      },
      {
        title: "Implementing Layouts",
        lessons: [
          { title: "CSS Grid for page structure", duration: "22:30", type: "video", current: true },
          { title: "Flexbox for components", duration: "19:40", type: "video" },
          { title: "Responsive breakpoints from design specs", duration: "17:25", type: "video" },
          { title: "Quiz: Layout Concepts", duration: "5 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 7,
    slug: "digital-marketing-strategy",
    title: "Digital Marketing & Growth Strategy",
    shortDescription:
      "Learn the channels, metrics, and frameworks that drive growth at modern companies — from SEO to paid ads to retention.",
    overview:
      "Marketing has fundamentally changed. This course covers how growth teams at startups and scaleups actually operate — the channels they prioritise, the metrics they obsess over, and the frameworks they use to make decisions quickly with incomplete data.",
    whatYouLearn: [
      "Build and run SEO content strategies",
      "Launch and optimise paid acquisition campaigns",
      "Understand conversion rate optimisation",
      "Set up attribution and analytics pipelines",
      "Write copy that converts across channels",
      "Design retention campaigns using email & SMS",
    ],
    instructor: {
      name: "Amara Diallo",
      title: "VP Growth, Series B SaaS company",
      initials: "AD",
      color: "bg-orange-500",
      bio: "Amara has led growth at three venture-backed companies, taking one from $1M to $20M ARR in 18 months. She teaches the frameworks she wishes she'd had earlier in her career — practical, data-driven, and free of hype.",
    },
    category: "Marketing",
    level: "Intermediate",
    rating: 4.6,
    reviewCount: 2340,
    studentCount: "16k+",
    duration: "20 hours",
    totalLessons: 34,
    price: 139,
    originalPrice: 219,
    image: "/assets/less8.avif",
    curriculum: [
      {
        title: "Growth Fundamentals",
        lessons: [
          { title: "The growth mindset and experimentation framework", duration: "15:30", type: "video" },
          { title: "Defining your north star metric", duration: "12:45", type: "video" },
          { title: "Channel selection and prioritisation", duration: "18:20", type: "video" },
        ],
      },
      {
        title: "Acquisition Channels",
        lessons: [
          { title: "SEO: technical and content fundamentals", duration: "26:10", type: "video", current: true },
          { title: "Google Ads: campaign structure and bidding", duration: "22:35", type: "video" },
          { title: "Social ads: creative testing at scale", duration: "19:50", type: "video" },
          { title: "Quiz: Channel Strategy", duration: "8 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 8,
    slug: "devops-cloud-aws",
    title: "DevOps & Cloud Engineering on AWS",
    shortDescription:
      "Learn how to build, ship, and operate software infrastructure on AWS. Covers Docker, Kubernetes, Terraform, and CI/CD pipelines.",
    overview:
      "Modern engineering teams expect developers to understand how their code runs in production. This course teaches the infrastructure skills that make you a 10x more effective engineer — not just theory, but hands-on labs with a real AWS account.",
    whatYouLearn: [
      "Containerise applications with Docker",
      "Orchestrate workloads with Kubernetes (EKS)",
      "Provision infrastructure with Terraform",
      "Build zero-downtime CI/CD pipelines",
      "Monitor and alert with CloudWatch and Grafana",
      "Implement IAM security best practices",
    ],
    instructor: {
      name: "Liam Okonkwo",
      title: "Staff Infrastructure Engineer, Cloudflare",
      initials: "LO",
      color: "bg-slate-600",
      bio: "Liam has spent 12 years building and operating large-scale distributed systems at Cloudflare and previously at AWS itself. He holds multiple AWS certifications and has presented at KubeCon.",
    },
    category: "Programming",
    level: "Advanced",
    rating: 4.8,
    reviewCount: 1650,
    studentCount: "11k+",
    duration: "36 hours",
    totalLessons: 56,
    price: 189,
    originalPrice: 319,
    image: "/assets/less9.webp",
    curriculum: [
      {
        title: "Docker & Containerisation",
        lessons: [
          { title: "Why containers? Problems they solve", duration: "13:20", type: "video" },
          { title: "Writing production-grade Dockerfiles", duration: "25:40", type: "video" },
          { title: "Docker Compose for local development", duration: "20:15", type: "video" },
        ],
      },
      {
        title: "Kubernetes in Practice",
        lessons: [
          { title: "Kubernetes architecture and core objects", duration: "28:10", type: "video", current: true },
          { title: "Deployments, services and ingress", duration: "24:35", type: "video" },
          { title: "Helm charts for application packaging", duration: "19:50", type: "video" },
          { title: "Quiz: K8s Concepts", duration: "10 Questions", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 9,
    slug: "product-design-strategy",
    title: "Product Design: Strategy Through Delivery",
    shortDescription:
      "A senior designer's guide to owning the full product design process — from strategy and discovery to shipped features.",
    overview:
      "This course is for designers who want to operate at a strategic level, not just execute on briefs. You'll learn how to influence product direction, run discovery with confidence, and ship designs that actually move business metrics.",
    whatYouLearn: [
      "Lead product discovery and opportunity sizing",
      "Facilitate design sprints and workshops",
      "Build and maintain a component library",
      "Write design critiques that improve outcomes",
      "Measure the impact of design decisions",
      "Manage stakeholder relationships across functions",
    ],
    instructor: {
      name: "Priya Patel",
      title: "Senior Product Designer, Airbnb",
      initials: "PP",
      color: "bg-rose-500",
      bio: "Priya is a product designer with 8 years at Airbnb and Spotify. She's led design for features used by millions and speaks regularly at UX conferences.",
    },
    category: "Design",
    level: "Advanced",
    rating: 4.7,
    reviewCount: 760,
    studentCount: "5k+",
    duration: "22 hours",
    totalLessons: 36,
    price: 149,
    originalPrice: 249,
    image: "/assets/less10.webp",
    curriculum: [
      {
        title: "Strategic Design Thinking",
        lessons: [
          { title: "Framing problems, not solutions", duration: "16:45", type: "video" },
          { title: "Running discovery interviews", duration: "22:10", type: "video" },
          { title: "Opportunity sizing and prioritisation", duration: "18:30", type: "video" },
        ],
      },
      {
        title: "Execution & Delivery",
        lessons: [
          { title: "Design system governance", duration: "20:55", type: "video", current: true },
          { title: "Writing a design spec engineers will read", duration: "14:40", type: "video" },
          { title: "Measuring design success post-launch", duration: "17:15", type: "video" },
          { title: "Quiz: Product Design Process", duration: "6 Questions", type: "quiz" },
        ],
      },
    ],
  },
];

export function getCourseBySlug(slug: string): CourseData | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByCategory(category: string): CourseData[] {
  if (category === "All") return courses;
  return courses.filter((c) => c.category === category);
}

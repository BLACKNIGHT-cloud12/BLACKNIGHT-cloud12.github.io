/**
 * Portfolio & Blog Configuration
 * Customize your details, projects, skills, and blog posts here!
 */
window.SITE_CONFIG = {
  profile: {
    name: "Soumik",
    title: "Full-Stack Engineer & Creative Developer",
    statusBadge: "Available for new projects & roles",
    location: "Global / Remote",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", // Replace with your photo URL or assets/images/avatar.jpg
    shortBio: "Building high-performance web applications, scalable backend systems, and interactive 3D digital experiences.",
    about: `
      I am a passionate software engineer focused on building elegant, performant, and reliable digital products. 
      My work bridges the gap between scalable engineering architectures and delightful, interactive user interfaces.
      I love exploring cutting-edge web technologies, creative computing with Three.js / WebGL, and writing about tech.
    `,
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "mailto:your-email@example.com"
    },
    resumeUrl: "#contact"
  },

  skills: [
    {
      category: "Frontend & Creative",
      items: [
        { name: "JavaScript / TypeScript", level: "Expert" },
        { name: "React / Next.js", level: "Advanced" },
        { name: "Three.js / WebGL", level: "Advanced" },
        { name: "Tailwind CSS", level: "Expert" },
        { name: "HTML5 / Canvas", level: "Expert" }
      ]
    },
    {
      category: "Backend & Systems",
      items: [
        { name: "Node.js / Express", level: "Advanced" },
        { name: "Python / FastAPI", level: "Advanced" },
        { name: "PostgreSQL / Redis", level: "Intermediate" },
        { name: "REST & GraphQL APIs", level: "Advanced" }
      ]
    },
    {
      category: "Cloud & Tooling",
      items: [
        { name: "Git & GitHub Actions", level: "Expert" },
        { name: "Docker", level: "Intermediate" },
        { name: "AWS / Cloudflare", level: "Intermediate" },
        { name: "Linux / Shell", level: "Advanced" }
      ]
    }
  ],

  projects: [
    {
      id: "project-1",
      title: "HyperFlow - Distributed Workflow Engine",
      description: "A fault-tolerant distributed task execution engine built with Go and Redis, featuring a real-time visual pipeline designer and metrics dashboard.",
      tags: ["Go", "Distributed Systems", "Redis", "React", "WebSockets"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: true,
      badge: "Featured Project"
    },
    {
      id: "project-2",
      title: "Nebula 3D - Audio-Reactive Particle Visualizer",
      description: "Interactive GPU particle simulation in Three.js and Web Audio API that transforms musical frequencies into responsive 3D fluid dynamics in real time.",
      tags: ["Three.js", "WebGL", "Web Audio API", "GLSL Shaders", "TypeScript"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: true,
      badge: "Creative Tech"
    },
    {
      id: "project-3",
      title: "PulseMetrics - Real-Time API Analytics",
      description: "Lightweight, privacy-first API monitoring platform handling 10M+ events daily with sub-millisecond anomaly detection and automated alerting.",
      tags: ["Python", "FastAPI", "ClickHouse", "Tailwind CSS", "Docker"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: true,
      badge: "Open Source"
    },
    {
      id: "project-4",
      title: "Minimalist Markdown CMS",
      description: "Git-backed content management system designed for developers with live previews, syntax highlighting, and zero-config static site generation.",
      tags: ["Node.js", "Markdown", "Tailwind", "GitHub API"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: false
    }
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      company: "Tech Systems Inc.",
      period: "2024 - Present",
      description: "Spearheaded frontend architecture modernization, reduced initial load times by 45%, and mentored junior engineers on cloud native patterns."
    },
    {
      role: "Full-Stack Developer",
      company: "Creative Cloud Labs",
      period: "2022 - 2024",
      description: "Engineered scalable microservices, integrated real-time analytics dashboards, and built interactive WebGL product showcases."
    },
    {
      role: "Software Engineering Intern",
      company: "Digital Innovations",
      period: "2021 - 2022",
      description: "Contributed to core REST API services and implemented automated CI/CD deployment pipelines using GitHub Actions."
    }
  ],

  // Registered blog posts
  posts: [
    {
      slug: "interactive-3d-on-the-web",
      title: "Building High-Performance 3D Web Experiences with Three.js",
      date: "Nov 20, 2026",
      readingTime: "5 min read",
      tags: ["Three.js", "WebGL", "Creative Dev"],
      excerpt: "A deep dive into optimizing particle geometries, managing frame budgets, and handling shaders smoothly across both desktop and mobile browsers.",
      file: "assets/posts/interactive-3d-on-the-web.md"
    },
    {
      slug: "modern-frontend-architecture",
      title: "Architecting Web Apps for Zero Build Friction and Maximum Speed",
      date: "Nov 12, 2026",
      readingTime: "7 min read",
      tags: ["Architecture", "JavaScript", "Performance"],
      excerpt: "Why modern vanilla web standards, utility-first CSS, and modern CDNs are making complex build chains optional for many developer websites.",
      file: "assets/posts/modern-frontend-architecture.md"
    },
    {
      slug: "mastering-github-pages",
      title: "Everything You Need to Know to Host Your Portfolio on GitHub Pages",
      date: "Nov 05, 2026",
      readingTime: "4 min read",
      tags: ["GitHub Pages", "DevOps", "Guide"],
      excerpt: "Step-by-step walkthrough of custom domains, GitHub Actions workflows, SSL certificates, and SEO optimization for your personal github.io site.",
      file: "assets/posts/mastering-github-pages.md"
    }
  ]
};

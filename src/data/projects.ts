export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'weroad-platform',
    title: 'WeRoad Travel Experience Platform',
    description:
      'Engineered production-grade user-facing features, composables, and components during large-scale migration to Nuxt 3 with SSR optimization.',
    longDescription:
      'Contributed to the frontend engineering at WeRoad, migrating legacy Nuxt 2 codebases to Nuxt Bridge and Nuxt 3. Developed high-performance composables, responsive Tailwind UI components, and SSR architecture that boosted SEO visibility and Core Web Vitals.',
    technologies: ['Vue.js', 'Nuxt 3', 'TypeScript', 'Tailwind CSS', 'SSR'],
    githubUrl: 'https://github.com/haddadilyas',
    liveUrl: 'https://www.weroad.com',
  },
  {
    id: 'bticino-backend',
    title: 'BTicino IoT & Building Automation Backend',
    description:
      'Developed and maintained scalable REST APIs for production systems, integrating backend data services with Angular frontend modules.',
    longDescription:
      'Engineered mission-critical backend REST APIs for the BTicino ecosystem at Space Informatica. Implemented clean data processing pipelines, robust endpoints, and full-stack Angular integrations with rigorous code quality standards.',
    technologies: ['Java', 'Spring Boot', 'REST APIs', 'Angular', 'PostgreSQL'],
    githubUrl: 'https://github.com/haddadilyas',
  },
  {
    id: 'hetzner-booking',
    title: 'Hetzner Workspace Booking System',
    description:
      'Full-stack office workspace and desk reservation application built with Spring Boot, managing real-time slot scheduling and user bookings.',
    longDescription:
      'Designed and developed the end-to-end booking logic for Hetzner workspace facilities. Implemented scheduling algorithms, automated slot allocations, and backend APIs for managing office capacity and reservations.',
    technologies: ['Spring Boot', 'Java', 'REST APIs', 'PostgreSQL', 'Full-Stack'],
    githubUrl: 'https://github.com/haddadilyas',
  },
  {
    id: 'desktop-os',
    title: 'Interactive Desktop OS Portfolio',
    description:
      'A cinematic personal developer operating system featuring multi-window management, 8-directional window resizing, draggable desktop icons, and interactive apps.',
    longDescription:
      'Reimagined developer portfolios into an interactive desktop environment. Built with React, TypeScript, Framer Motion, and Tailwind CSS, featuring realistic window stacking, traffic lights, and localStorage grid persistence.',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    githubUrl: 'https://github.com/haddadilyas/portfolio',
    liveUrl: 'https://github.com/haddadilyas',
  },
];

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    id: 'weroad',
    company: 'WeRoad',
    role: 'Frontend Software Engineer',
    period: 'Sep 2023 – Sep 2025',
    location: 'Milan',
    description:
      'Engineered and scaled production-grade frontend applications for WeRoad travel ecosystem, driving core architectural migrations, UI component libraries, and SSR performance optimizations.',
    highlights: [
      'Developed and maintained production-grade user-facing features using Nuxt 2, Nuxt Bridge, and Nuxt 3, contributing to the migration of a large-scale codebase to the latest framework architecture.',
      'Built reusable, responsive UI components and composables with Vue.js, TypeScript, and Tailwind CSS, improving consistency, maintainability, and development efficiency.',
      'Improved SEO and page performance through Nuxt SSR, metadata optimization, and semantic HTML, while strengthening application reliability through unit and integration testing.',
    ],
    technologies: ['Vue.js', 'Nuxt 3', 'Nuxt 2', 'TypeScript', 'Tailwind CSS', 'SSR', 'Jest', 'Git'],
  },
  {
    id: 'space-informatica',
    company: 'Space Informatica',
    role: 'Backend Developer Intern',
    period: 'Jun 2021 – Jan 2022',
    location: 'Milan',
    description:
      'Engineered backend services and REST APIs for client projects including BTicino and the Hetzner office workspace booking platform, spanning Java Spring Boot, data processing, and Angular frontends.',
    highlights: [
      'Developed and maintained REST APIs for the BTicino backend application, working with backend services, data processing, and API integration.',
      'Contributed to full-stack development tasks, implementing frontend features and integrations using Angular alongside backend services.',
      'Worked on the Hetzner office booking application with Spring Boot, contributing to the development of functionality for managing and booking office workspaces and slots.',
      'Collaborated with the development team to debug, test, and maintain application features, gaining hands-on experience across backend and frontend development.',
    ],
    technologies: ['Java', 'Spring Boot', 'REST APIs', 'Angular', 'PostgreSQL', 'API Integration'],
  },
];

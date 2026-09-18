export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'coding-languages',
    name: 'Coding Languages',
    skills: [
      'JavaScript (React.js, Vue.js)',
      'TypeScript',
      'Java (Spring Boot)',
      'Python',
      'PHP',
      'C',
      'Assembly',
      'HTML5 / CSS3',
    ],
  },
  {
    id: 'frameworks-web',
    name: 'Frameworks & Web',
    skills: [
      'Vue.js (Nuxt 2, Nuxt 3)',
      'React.js',
      'Angular',
      'Spring Boot',
      'Tailwind CSS',
      'Nuxt Bridge / SSR',
      'REST APIs',
    ],
  },
  {
    id: 'content-programs',
    name: 'Content & Creative Tools',
    skills: ['OBS Studio', 'CapCut', 'Adobe Photoshop', 'Editing MCP (Higgsfield)'],
  },
  {
    id: 'cloud-systems',
    name: 'Cloud & Engineering',
    skills: [
      'Cloud Computing',
      'Distributed Systems',
      'PostgreSQL',
      'Docker',
      'Git & GitHub',
      'Unit & Integration Testing',
    ],
  },
  {
    id: 'spoken-languages',
    name: 'Spoken Languages',
    skills: ['Italian (Native)', 'English (B2/C1)', 'French (A2)'],
  },
];

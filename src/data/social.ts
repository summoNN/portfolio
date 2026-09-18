export const social = {
  github: {
    username: 'summoNN',
    url: 'https://github.com/summoNN',
    bio: 'Frontend Software Engineer & Fullstack Developer based in Milan.',
    repos: [
      {
        name: 'weroad-frontend-features',
        description: 'Reusable Nuxt 3 composables and UI component design system',
        language: 'Vue',
        languageColor: '#41b883',
        stars: 34,
        forks: 6,
      },
      {
        name: 'bticino-api-services',
        description: 'Production REST API services and data integration layer',
        language: 'Java',
        languageColor: '#b07219',
        stars: 22,
        forks: 4,
      },
      {
        name: 'hetzner-office-booking',
        description: 'Workspace reservation application built with Spring Boot & PostgreSQL',
        language: 'Java',
        languageColor: '#b07219',
        stars: 18,
        forks: 3,
      },
      {
        name: 'portfolio-os',
        description: 'Cinematic desktop operating system portfolio built with React & TypeScript',
        language: 'TypeScript',
        languageColor: '#3178c6',
        stars: 48,
        forks: 9,
      },
    ],
    contributions: generateContributions(),
  },
  linkedin: {
    name: 'Ilyas Haddad',
    headline: 'Frontend Software Engineer | Vue.js, Nuxt 3, TypeScript & Fullstack',
    url: 'https://linkedin.com/in/ilyas-haddad',
    about:
      'Frontend Software Engineer with production experience at WeRoad (Nuxt 2/3, Vue.js, TypeScript, Tailwind) and backend background at Space Informatica (Java, Spring Boot, REST APIs). Graduate of ITS Talent Tech Factory as Fullstack Engineer with Cloud Technologies (91/100, GPA 4.0).',
    skills: [
      'Vue.js',
      'Nuxt 3',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Java',
      'Spring Boot',
      'REST APIs',
      'PostgreSQL',
      'Docker',
    ],
  },
} as const;

function generateContributions(): number[][] {
  const weeks = 52;
  const days = 7;
  const grid: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      if (rand < 0.3) week.push(0);
      else if (rand < 0.55) week.push(1);
      else if (rand < 0.75) week.push(2);
      else if (rand < 0.9) week.push(3);
      else week.push(4);
    }
    grid.push(week);
  }
  return grid;
}

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
    id: 'chadi-motion',
    title: 'Chadi Motion',
    description:
      'Portfolio designed for chadi motion using his 3d assets, developed admin access in order to CRUD his projects by himself',
    technologies: ['React.js', 'Next 3', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/haddadilyas',
    liveUrl: 'https://www.chadi-motion.com/',
  }
];

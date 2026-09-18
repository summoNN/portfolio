import type { ComponentType } from 'react';
import {
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  FileText,
  Mail,
} from 'lucide-react';
import { Github, Linkedin } from '../components/UI/Icons';

export interface AppDefinition {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;
  color: string;
  inDock: boolean;
}

export const apps: AppDefinition[] = [
  {
    id: 'about',
    label: 'About',
    icon: User,
    color: '#636366',
    inDock: false,
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: Briefcase,
    color: '#48484a',
    inDock: false,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderGit2,
    color: '#545456',
    inDock: false,
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Cpu,
    color: '#5a5a5c',
    inDock: false,
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    color: '#4a4a4c',
    inDock: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: Github,
    color: '#3a3a3c',
    inDock: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    color: '#3a3a3c',
    inDock: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail,
    color: '#3a3a3c',
    inDock: true,
  },
];

export const gridApps = apps.filter((a) => !a.inDock);
export const dockApps = apps.filter((a) => a.inDock);

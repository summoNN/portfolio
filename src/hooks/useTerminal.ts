import { useState, useCallback } from 'react';
import { profile } from '../data/profile';
import { config } from '../data/config';
import { experiences } from '../data/experience';

interface TerminalLine {
  id: number;
  type: 'input' | 'output';
  content: string;
}

const COMMANDS: Record<string, string> = {
  whoami: `${profile.name} — ${profile.title}\nBased in ${profile.location}`,
  about: profile.bio,
  location: profile.location,
  focus: profile.currentFocus,
  contact: `Email: ${config.email}\nPhone: ${config.phone}\nLinkedIn: ${config.linkedinUrl}\nGitHub: ${config.githubUrl}`,
  education: `${profile.education.institution} (${profile.education.date})
Degree: ${profile.education.degree}
Grade: ${profile.education.grade}
Coursework: ${profile.education.coursework.join(', ')}`,
  experience: experiences
    .map(
      (exp) => `${exp.role} @ ${exp.company} (${exp.period})
  ${exp.description}
  Tech: ${exp.technologies.join(', ')}`
    )
    .join('\n\n'),
  skills: `Coding Languages: JavaScript (React.js, Vue.js), Java (Spring Boot), Python, PHP, C, Assembly
Frameworks & Web: Nuxt 2/3, Vue.js, React, Angular, Tailwind CSS, REST APIs
Content Tools: OBS Studio, CapCut, Photoshop, Editing MCP (Higgsfield)
Spoken Languages: Italian (Native), English (B2/C1), French (A2)`,
  clear: '__CLEAR__',
  help: `Available commands:

  whoami       Who am I?
  about        About Ilyas Haddad
  experience   Work history (WeRoad, Space Informatica)
  education    ITS Talent Tech Factory degree & coursework
  skills       Languages, frameworks & creative tools
  contact      Email, phone, LinkedIn & GitHub
  clear        Clear the terminal
  help         Display this help menu`,
};

let lineId = 0;

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: lineId++, type: 'output', content: `Welcome to ${profile.name}'s terminal (Milan, Italy).` },
    { id: lineId++, type: 'output', content: 'Type "help" to explore available commands.\n' },
  ]);
  const [input, setInput] = useState('');

  const execute = useCallback((command: string) => {
    const trimmed = command.trim().toLowerCase();
    const newLines: TerminalLine[] = [
      { id: lineId++, type: 'input', content: `$ ${command}` },
    ];

    if (trimmed === '') {
      // empty
    } else if (trimmed === 'clear') {
      setLines([]);
      setInput('');
      return;
    } else if (COMMANDS[trimmed]) {
      newLines.push({ id: lineId++, type: 'output', content: COMMANDS[trimmed] });
    } else {
      newLines.push({
        id: lineId++,
        type: 'output',
        content: `command not found: ${trimmed}\nType "help" for available commands.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput('');
  }, []);

  return { lines, input, setInput, execute };
}

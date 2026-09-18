import { motion } from 'framer-motion';
import { ExternalLink, Briefcase, Award } from 'lucide-react';
import { AppWindow } from './AppWindow';
import { social } from '../../data/social';
import { config } from '../../data/config';
import { experiences } from '../../data/experience';

interface LinkedinAppProps {
  onBack: () => void;
}

export function LinkedinApp({ onBack }: LinkedinAppProps) {
  const li = social.linkedin;

  const openLinkedin = (
    <motion.a
      href={config.linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ios-accent"
      whileTap={{ opacity: 0.5 }}
      aria-label="Open LinkedIn profile"
    >
      <ExternalLink size={18} />
    </motion.a>
  );

  return (
    <AppWindow title="LinkedIn" onBack={onBack} rightAction={openLinkedin}>
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Profile header */}
        <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] overflow-hidden">
          {/* Banner */}
          <div className="h-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
          <div className="px-4 pb-4 -mt-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 border-3 border-black flex items-center justify-center text-xl font-bold text-white/80 mb-2">
              {config.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <h2 className="text-base font-bold text-white">{li.name}</h2>
            <p className="text-sm text-white/50 mt-0.5">{li.headline}</p>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            About
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">{li.about}</p>
        </div>

        {/* Experience */}
        <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={14} className="text-white/40" />
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Experience
            </h3>
          </div>
          {experiences.map((exp, i) => (
            <div key={exp.id}>
              <div className="py-2">
                <h4 className="text-sm font-semibold text-white/80">{exp.role}</h4>
                <p className="text-xs text-white/50">{exp.company} · {exp.period}</p>
              </div>
              {i < experiences.length - 1 && <div className="h-px bg-white/[0.06]" />}
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={14} className="text-white/40" />
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Skills
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {li.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs font-medium text-white/60 bg-white/[0.05] rounded-full border border-white/[0.06]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Connect button */}
        <motion.a
          href={config.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-ios-accent/20 border border-ios-accent/30 text-ios-accent text-sm font-semibold no-underline"
          whileTap={{ scale: 0.98 }}
        >
          Connect on LinkedIn
        </motion.a>
      </motion.div>
    </AppWindow>
  );
}

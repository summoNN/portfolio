import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { AppWindow } from './AppWindow';
import { experiences } from '../../data/experience';

interface ExperienceAppProps {
  onBack: () => void;
}

export function ExperienceApp({ onBack }: ExperienceAppProps) {
  return (
    <AppWindow title="Experience" onBack={onBack}>
      <div className="flex flex-col gap-5">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-5 shadow-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-white/[0.08] pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">{exp.role}</h3>
                  <span className="text-white/40">•</span>
                  <span className="text-sm font-semibold text-white/80">{exp.company}</span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                    <MapPin size={12} />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-mono text-white/50 bg-white/[0.06] px-2.5 py-1 rounded-md mt-1 sm:mt-0 self-start">
                {exp.period}
              </span>
            </div>

            {/* Main Description */}
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {exp.description}
            </p>

            {/* Bullet Points */}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul className="mt-3.5 space-y-2 text-xs sm:text-sm text-white/80 list-disc list-outside pl-4">
                {exp.highlights.map((item, i) => (
                  <li key={i} className="leading-relaxed text-white/75">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Technology tags */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.06]">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[11px] font-medium text-white/70 bg-white/[0.05] rounded-md border border-white/[0.08]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </AppWindow>
  );
}

import { motion } from 'framer-motion';
import { AppWindow } from './AppWindow';
import { skillCategories } from '../../data/skills';

interface SkillsAppProps {
  onBack: () => void;
}

export function SkillsApp({ onBack }: SkillsAppProps) {
  return (
    <AppWindow title="Skills" onBack={onBack}>
      <div className="flex flex-col gap-4">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={category.id}
            className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * catIndex }}
          >
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <motion.span
                  key={skill}
                  className="px-3 py-2 text-[13px] font-medium text-white/70 bg-white/[0.05] rounded-xl border border-white/[0.06] hover:bg-white/[0.1] transition-colors cursor-default"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 * catIndex + 0.03 * skillIndex }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </AppWindow>
  );
}

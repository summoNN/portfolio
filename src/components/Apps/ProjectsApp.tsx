import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { Github } from '../UI/Icons';
import { AppWindow } from './AppWindow';
import { projects, type Project } from '../../data/projects';

interface ProjectsAppProps {
  onBack: () => void;
}

export function ProjectsApp({ onBack }: ProjectsAppProps) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <AppWindow
      title={selected ? selected.title : 'Projects'}
      onBack={selected ? () => setSelected(null) : onBack}
    >
      <AnimatePresence mode="wait">
        {selected ? (
          <ProjectDetail key="detail" project={selected} />
        ) : (
          <ProjectList
            key="list"
            projects={projects}
            onSelect={setSelected}
          />
        )}
      </AnimatePresence>
    </AppWindow>
  );
}

function ProjectList({
  projects: items,
  onSelect,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
}) {
  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {items.map((project, index) => (
        <motion.button
          key={project.id}
          className="w-full text-left rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4 cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          onClick={() => onSelect(project)}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-white">
                {project.title}
              </h3>
              <p className="text-sm text-white/50 mt-1 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[10px] font-medium text-white/50 bg-white/[0.05] rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 flex-shrink-0 ml-2" />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Image placeholder */}
      <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/[0.06] flex items-center justify-center">
        <span className="text-white/20 text-sm">Preview</span>
      </div>

      {/* Description */}
      <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
        <p className="text-sm text-white/70 leading-relaxed">
          {project.longDescription || project.description}
        </p>
      </div>

      {/* Technologies */}
      <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
        <h4 className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">
          Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs font-medium text-white/60 bg-white/[0.06] rounded-full border border-white/[0.06]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.08] border border-white/[0.08] text-white/70 text-sm font-medium no-underline hover:bg-white/[0.12] transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-ios-accent/20 border border-ios-accent/30 text-ios-accent text-sm font-medium no-underline hover:bg-ios-accent/30 transition-colors"
          >
            <ExternalLink size={16} />
            Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );
}

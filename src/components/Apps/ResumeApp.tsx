import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Eye, AlignLeft, MapPin, Mail, Phone, GraduationCap } from 'lucide-react';
import { AppWindow } from './AppWindow';
import { config } from '../../data/config';
import { profile } from '../../data/profile';
import { experiences } from '../../data/experience';
import { skillCategories } from '../../data/skills';

interface ResumeAppProps {
  onBack: () => void;
}

export function ResumeApp({ onBack }: ResumeAppProps) {
  const [viewMode, setViewMode] = useState<'pdf' | 'document'>('pdf');

  const headerRightAction = (
    <div className="flex items-center gap-1 text-white/70">
      <a
        href={config.resumePath}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
        title="Open PDF in new tab"
      >
        <ExternalLink size={15} />
      </a>
      <a
        href={config.resumePath}
        download="Ilyas_Haddad_Resume.pdf"
        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
        title="Download Resume"
      >
        <Download size={15} />
      </a>
    </div>
  );

  return (
    <AppWindow title="Resume — Ilyas Haddad" onBack={onBack} noPadding rightAction={headerRightAction}>
      <div className="flex flex-col h-full w-full bg-[#111113] select-text">
        {/* Top Control Bar / Toolbar */}
        <div className="h-11 px-3 sm:px-4 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between flex-shrink-0 select-none z-10">
          {/* File info pill */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-white/80">
              <FileText size={13} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-white/90">Ilyas_Haddad_Resume.pdf</span>
              <span className="hidden sm:inline text-[11px] text-white/40 font-mono">101 KB</span>
            </div>
          </div>

          {/* Center Mode Switcher */}
          <div className="flex items-center bg-white/[0.06] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'pdf'
                  ? 'bg-white/20 text-white font-medium shadow-sm'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Eye size={12} />
              <span>PDF Viewer</span>
            </button>
            <button
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'document'
                  ? 'bg-white/20 text-white font-medium shadow-sm'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <AlignLeft size={12} />
              <span>Curriculum View</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={config.resumePath}
              download="Ilyas_Haddad_Resume.pdf"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium transition-colors no-underline shadow-sm"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Content View Area */}
        <div className="flex-1 min-h-0 relative w-full overflow-hidden">
          {viewMode === 'pdf' ? (
            <div className="w-full h-full flex flex-col relative bg-[#18181b]">
              {/* Native PDF Viewer inside iframe */}
              <iframe
                src={`${config.resumePath}#view=FitH`}
                title="Ilyas Haddad Resume PDF Preview"
                className="w-full h-full border-none bg-[#1e1e1e]"
              />

              {/* Bottom Quick Bar */}
              <div className="h-8 px-4 border-t border-white/5 bg-black/80 flex items-center justify-between text-[11px] text-white/50 select-none">
                <span>Direct PDF rendering from {config.resumePath}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode('document')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Switch to Curriculum View
                  </button>
                  <span>•</span>
                  <a
                    href={config.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors no-underline text-white/60"
                  >
                    Open in Full Window
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Clean Formatted Document View */
            <div className="w-full h-full overflow-y-auto app-scroll p-4 sm:p-6 md:p-8 bg-black/40">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto rounded-xl bg-white/[0.04] border border-white/[0.09] shadow-2xl p-6 sm:p-8 flex flex-col gap-6"
              >
                {/* Document Header */}
                <div className="border-b border-white/10 pb-5">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h1>
                  <p className="text-base text-white/70 mt-0.5">{profile.title}</p>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {profile.location}
                    </span>
                    <a
                      href={`mailto:${config.email}`}
                      className="flex items-center gap-1.5 hover:text-white transition-colors no-underline text-white/60"
                    >
                      <Mail size={13} /> {config.email}
                    </a>
                    {config.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} /> {config.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Professional Profile
                  </h2>
                  <p className="text-sm text-white/80 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Work Experience */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                    Work Experience
                  </h2>
                  <div className="flex flex-col gap-5">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="rounded-lg bg-white/[0.03] p-4 border border-white/[0.05]">
                        <div className="flex items-baseline justify-between flex-wrap gap-1">
                          <h3 className="text-sm font-semibold text-white">
                            {exp.role} <span className="text-white/40 font-normal">at</span> {exp.company}
                          </h3>
                          <span className="text-xs text-white/40 font-mono">{exp.period}</span>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">{exp.location}</p>

                        {/* Bullet Points */}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-xs text-white/75 list-disc list-outside pl-4">
                            {exp.highlights.map((bullet, i) => (
                              <li key={i} className="leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex flex-wrap gap-1.5 mt-3.5 pt-2.5 border-t border-white/[0.05]">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono text-white/60 bg-white/[0.05] border border-white/[0.08]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-1.5">
                    <GraduationCap size={14} />
                    <span>Education</span>
                  </h2>
                  <div className="rounded-lg bg-white/[0.03] p-4 border border-white/[0.05]">
                    <div className="flex items-baseline justify-between flex-wrap gap-1">
                      <h3 className="text-sm font-semibold text-white">
                        {profile.education.institution}
                      </h3>
                      <span className="text-xs text-white/40 font-mono">{profile.education.date}</span>
                    </div>
                    <p className="text-xs text-white/70 mt-1 font-medium">
                      {profile.education.degree} • {profile.education.location}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      Grade: <strong className="text-white/80">{profile.education.grade}</strong>
                    </p>
                    <div className="mt-2.5">
                      <p className="text-[11px] text-white/40 uppercase tracking-wider">Relevant Coursework:</p>
                      <p className="text-xs text-white/65 mt-1 leading-relaxed">
                        {profile.education.coursework.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Skills & Tools */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                    Key Skills & Programs
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skillCategories.map((cat) => (
                      <div key={cat.id} className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.05]">
                        <p className="text-xs font-semibold text-white/70 mb-2">{cat.name}</p>
                        <div className="flex flex-wrap gap-1">
                          {cat.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded text-[11px] text-white/65 bg-white/[0.04] border border-white/[0.04]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Footer */}
                <div className="border-t border-white/10 pt-5 flex items-center justify-between">
                  <span className="text-xs text-white/40">Official PDF Curriculum</span>
                  <a
                    href={config.resumePath}
                    download="Ilyas_Haddad_Resume.pdf"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors no-underline border border-white/15"
                  >
                    <Download size={14} />
                    Download Official PDF
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </AppWindow>
  );
}

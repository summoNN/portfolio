import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { Github } from '../UI/Icons';
import { AppWindow } from './AppWindow';
import { social } from '../../data/social';
import { config } from '../../data/config';

interface GithubAppProps {
  onBack: () => void;
}

const CONTRIBUTION_COLORS = [
  'rgba(255,255,255,0.05)',
  'rgba(255,255,255,0.15)',
  'rgba(255,255,255,0.3)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.85)',
];

export function GithubApp({ onBack }: GithubAppProps) {
  const gh = social.github;

  const openGithub = (
    <a
      href={config.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
      title="Open GitHub profile"
      aria-label="Open GitHub profile"
    >
      <ExternalLink size={16} />
    </a>
  );

  return (
    <AppWindow title="GitHub — summoNN" onBack={onBack} rightAction={openGithub}>
      <motion.div
        className="flex flex-col gap-4 select-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4.5 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-black flex items-center justify-center text-white/90 border border-white/10 flex-shrink-0 shadow-md">
              <Github size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{gh.username}</h2>
                <span className="text-[11px] font-mono text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-md">
                  PRO
                </span>
              </div>
              <p className="text-xs text-white/55 mt-0.5 leading-snug">{gh.bio}</p>
            </div>
          </div>

          <a
            href={config.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-white transition-colors no-underline shadow-sm"
          >
            <span>Follow</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Contribution Activity Graph */}
        <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4.5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Contribution Activity
            </h3>
            <span className="text-[11px] font-mono text-white/40">52 weeks</span>
          </div>

          <div className="flex gap-[3px] overflow-hidden py-1">
            {gh.contributions.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className="rounded-[2px]"
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: CONTRIBUTION_COLORS[level],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/35 mt-2 pt-2 border-t border-white/[0.05]">
            <span>Less</span>
            <div className="flex gap-1 items-center">
              {CONTRIBUTION_COLORS.map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Repositories */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Pinned & Highlighted Repositories
            </h3>
            <a
              href={`${config.githubUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white/80 transition-colors no-underline"
            >
              View all
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gh.repos.map((repo, index) => (
              <motion.a
                key={repo.name}
                href={`${config.githubUrl}/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 p-4 transition-all duration-200 no-underline group block"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors truncate">
                    {repo.name}
                  </h4>
                  <ExternalLink size={12} className="text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-white/50 mt-1.5 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
                <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    <span className="text-[11px] text-white/40 font-medium">{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <Star size={11} />
                    <span className="text-[11px] font-mono">{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <GitFork size={11} />
                    <span className="text-[11px] font-mono">{repo.forks}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </AppWindow>
  );
}

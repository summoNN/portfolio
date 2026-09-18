import { motion } from 'framer-motion';
import { MapPin, Crosshair, GraduationCap, Languages, Sparkles } from 'lucide-react';
import { AppWindow } from './AppWindow';
import { profile } from '../../data/profile';

interface AboutAppProps {
  onBack: () => void;
}

export function AboutApp({ onBack }: AboutAppProps) {
  return (
    <AppWindow title="About" onBack={onBack}>
      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-black flex items-center justify-center text-3xl font-bold text-white/90 shadow-xl border border-white/10">
          {profile.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>

        {/* Name & Title */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-white tracking-tight">{profile.name}</h1>
          <p className="text-sm text-white/60 mt-1">{profile.title}</p>
        </div>

        {/* Bio card */}
        <div className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4.5">
          <p className="text-sm text-white/80 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Info rows */}
        <div className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-hidden">
          <InfoRow
            icon={<MapPin size={17} className="text-white/40" />}
            label="Location"
            value={profile.location}
          />
          <div className="h-px bg-white/[0.06]" />
          <InfoRow
            icon={<Crosshair size={17} className="text-white/40" />}
            label="Focus"
            value={profile.currentFocus}
          />
          <div className="h-px bg-white/[0.06]" />
          <InfoRow
            icon={<GraduationCap size={17} className="text-white/40" />}
            label="Education"
            value={`${profile.education.institution} • ${profile.education.degree} (${profile.education.grade})`}
          />
        </div>

        {/* Spoken Languages */}
        <div className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Languages size={16} className="text-white/40" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Spoken Languages
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.spokenLanguages.map((lang) => (
              <span
                key={lang.language}
                className="px-3 py-1 text-xs font-medium text-white/80 bg-white/[0.06] rounded-full border border-white/[0.08] flex items-center gap-1.5"
              >
                <span className="font-semibold text-white">{lang.language}</span>
                <span className="text-white/40">({lang.level})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Creative & Content Tools */}
        <div className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-white/40" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Creative & Video Production
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['OBS Studio', 'CapCut', 'Photoshop', 'Editing MCP (Higgsfield)'].map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 text-xs font-medium text-white/70 bg-white/[0.05] rounded-lg border border-white/[0.06]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AppWindow>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-white/40 font-medium">{label}</p>
        <p className="text-sm text-white/85 mt-0.5 leading-snug">{value}</p>
      </div>
    </div>
  );
}

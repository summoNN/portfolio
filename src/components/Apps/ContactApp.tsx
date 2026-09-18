import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Phone } from 'lucide-react';
import { Github, Linkedin } from '../UI/Icons';
import { AppWindow } from './AppWindow';
import { config } from '../../data/config';

interface ContactAppProps {
  onBack: () => void;
}

export function ContactApp({ onBack }: ContactAppProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.open(`mailto:${config.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <AppWindow title="Contact" onBack={onBack}>
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Quick contact channels */}
        <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-hidden shadow-lg">
          <ContactLink
            icon={<Mail size={18} className="text-white/70" />}
            label="Email"
            value={config.email}
            href={`mailto:${config.email}`}
          />
          {config.phone && (
            <>
              <div className="h-px bg-white/[0.06]" />
              <ContactLink
                icon={<Phone size={18} className="text-white/70" />}
                label="Phone"
                value={config.phone}
                href={`tel:${config.phone}`}
              />
            </>
          )}
          <div className="h-px bg-white/[0.06]" />
          <ContactLink
            icon={<Linkedin size={18} className="text-white/70" />}
            label="LinkedIn"
            value="linkedin.com/in/ilyas-haddad"
            href={config.linkedinUrl}
          />
          <div className="h-px bg-white/[0.06]" />
          <ContactLink
            icon={<Github size={18} className="text-white/70" />}
            label="GitHub"
            value={`github.com/${config.githubUsername}`}
            href={config.githubUrl}
          />
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Send a Direct Message
          </h3>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors resize-none"
          />

          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold cursor-pointer transition-colors shadow-md"
            whileTap={{ scale: 0.98 }}
          >
            <Send size={16} />
            Send Message
          </motion.button>

          <p className="text-[11px] text-white/25 text-center">
            Opens your default email client with your message prefilled
          </p>
        </form>
      </motion.div>
    </AppWindow>
  );
}

function ContactLink({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3.5 no-underline hover:bg-white/[0.04] transition-colors"
    >
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40 font-medium">{label}</p>
        <p className="text-sm text-white/80 truncate mt-0.5">{value}</p>
      </div>
    </a>
  );
}

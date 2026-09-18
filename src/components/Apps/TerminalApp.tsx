import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppWindow } from './AppWindow';
import { useTerminal } from '../../hooks/useTerminal';

interface TerminalAppProps {
  onBack: () => void;
}

export function TerminalApp({ onBack }: TerminalAppProps) {
  const { lines, input, setInput, execute } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    // Focus input when terminal opens
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
    }
  };

  return (
    <AppWindow title="Terminal" onBack={onBack} noPadding>
      <div
        className="flex flex-col h-full bg-black/80 font-mono text-[13px] leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Output area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto app-scroll p-4">
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                line.type === 'input'
                  ? 'text-ios-green font-semibold mt-1'
                  : 'text-white/60 whitespace-pre-wrap mb-1'
              }
            >
              {line.content}
            </motion.div>
          ))}

          {/* Input line */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-ios-green font-semibold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white/90 text-[13px] font-mono caret-ios-green"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

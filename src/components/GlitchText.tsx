import { useState, useEffect, useRef } from 'react';

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
const GLITCH_SPEED = 30;
const SETTLE_TIME = 1500;

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export default function GlitchText({ text, className = '', as: Tag = 'div' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Initial random text
    setDisplayText(text.split('').map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]).join(''));

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const totalLength = text.length;

      if (elapsed >= SETTLE_TIME) {
        setDisplayText(text);
        setIsComplete(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const stableIndex = Math.floor((elapsed / SETTLE_TIME) * totalLength);

      const newText = text.split('').map((char, index) => {
        if (index < stableIndex) return char;
        // 70% chance to show target char, 30% random
        if (Math.random() > 0.3) return char;
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }).join('');

      setDisplayText(newText);
    }, GLITCH_SPEED);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <Tag
      className={`${className} ${!isComplete ? 'text-glow' : ''}`}
      style={{ color: !isComplete ? '#06B6D4' : undefined }}
    >
      {displayText}
    </Tag>
  );
}

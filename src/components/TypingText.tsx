"use client";

import { useEffect, useState } from "react";

interface Props {
  texts: string[];
  className?: string;
}

export default function TypingText({ texts, className = "" }: Props) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const current = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplay(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);

          if (charIndex + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setDisplay(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);

          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setTextIndex((t) => (t + 1) % texts.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className={`typing-cursor ${className}`}>
      {display}
    </span>
  );
}

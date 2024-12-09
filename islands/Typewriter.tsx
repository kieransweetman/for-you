import { useTypewriter } from "../hooks/use-typewriter.ts";
import { useEffect, useState } from "preact/hooks";

interface TypewriterProps {
  speed?: number;
  className?: string;
  children: string;
  onTextRendered?: () => void;
}

const Typewriter = (
  { speed, className, children, onTextRendered }: TypewriterProps,
) => {
  const displayText = useTypewriter(children, speed);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayText === children) {
      setIsComplete(true);

      if (onTextRendered) {
        setTimeout(onTextRendered, 1500);
      }
    }
  }, [displayText, children, onTextRendered]);

  return (
    <p className={`${className} ${isComplete ? "fade-out" : ""}`}>
      {displayText}
    </p>
  );
};

export default Typewriter;

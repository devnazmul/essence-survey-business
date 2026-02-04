import React, { useEffect, useState } from "react";
import { Text, TextStyle } from "react-native";

interface TypewriterProps {
  text: string;
  delay?: number;
  style?: TextStyle;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  delay = 5,
  style,
  className,
}) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) return;

    let currentIndex = 0;
    setDisplayText("");

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prev) => prev + text.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return (
    <Text style={style} className={className}>
      {displayText}
    </Text>
  );
};

export default Typewriter;

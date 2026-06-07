import React from "react";
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
  // const [displayText, setDisplayText] = useState("");

  // useEffect(() => {
  //   if (!text) return;

  //   let currentIndex = 0;
  //   setDisplayText("");

  //   const intervalId = setInterval(() => {
  //     if (currentIndex < text.length) {
  //       const charToAdd = text.charAt(currentIndex);
  //       setDisplayText((prev) => prev + charToAdd);
  //       currentIndex++;
  //     } else {
  //       clearInterval(intervalId);
  //     }
  //   }, delay);

  //   return () => clearInterval(intervalId);
  // }, [text, delay]);
  // console.log({ displayText });
  return (
    <Text style={style} className={className}>
      {/* {displayText} */}
      {text}
    </Text>
  );
};

export default Typewriter;

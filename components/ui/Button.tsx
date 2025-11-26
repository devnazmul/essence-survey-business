import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { tv } from "tailwind-variants";

const button = tv({
  variants: {
    disabled: {
      true: "opacity-50",
      false: "",
    },
    color: {
      primary: "bg-primary ",
      secondary: "bg-secondary ",
      outline: "bg-transparent border border-primary ",
      inverse: "bg-base-300 ",
      "inverse-outline": "bg-transparent border border-base-300 ",
    },

    size: {
      xs: "px-2 py-1 rounded-md",
      sm: "px-2.5 py-1.5 rounded-lg",
      md: "px-3 py-2 rounded-lg",
      lg: "px-4 py-3 rounded-2xl",
      xl: "px-6 py-4 rounded-2xl",
      "2xl": "px-8 py-5 rounded-2xl",
    },
  },

  defaultVariants: {
    size: "md",
    color: "primary",
  },
});
const title = tv({
  variants: {
    disabled: {
      true: "text-base-300",
      false: "",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    color: {
      primary: "text-base-300",
      secondary: "text-base-300",
      outline: "text-primary",
      inverse: "text-primary",
      "inverse-outline": "text-base-300",
    },
  },

  defaultVariants: {
    size: "md",
    color: "primary",
    disabled: false,
  },
});

interface IButtonProps {
  label: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: "primary" | "secondary" | "outline" | "inverse" | "inverse-outline";
}

const Button: React.FC<IButtonProps> = ({
  label,
  onPress,
  disabled = false,
  size,
  color,
  className,
  textClassName,
  ...props
}) => {
  const { getResponsiveFontSize } = useDimension();
  return (
    <TouchableOpacity
      className={`${button({
        size: size,
        color: color,
        disabled: disabled,
      })} ${className}`}
      onPress={onPress}
      disabled={!!disabled}
      {...props}
    >
      <Text
        style={{
          fontSize: getResponsiveFontSize(size || "md"),
        }}
        className={`${title({ color: color, size: size, disabled: disabled })} ${textClassName}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

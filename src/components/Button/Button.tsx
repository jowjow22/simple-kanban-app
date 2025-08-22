import { cva } from "class-variance-authority";
import React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  variant?: "solid" | "outline" | "icon" | "danger";
  disabled?: boolean;
}

const buttonVariants = cva("rounded p-2", {
  variants: {
    size: {
      small: "text-xs p-1",
      medium: "text-sm p-2",
      large: "text-lg p-3",
    },
    variant: {
      solid: "bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700",
      danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      outline: "border border-cyan-500 text-blue-500",
      icon: "bg-transparent p-0 text-black",
    },
    disabled: {
      false: "",
      true: "opacity-50 cursor-not-allowed",
    },
  },
  defaultVariants: {
    size: "medium",
    variant: "solid",
  },
});

export const Button = (props: IButtonProps) => {
  return (
    <button
      className={buttonVariants({
        size: props.size,
        variant: props.variant,
        disabled: props.disabled,
      })}
      type="button"
      {...props}
    >
      {props.children}
    </button>
  );
};

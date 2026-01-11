import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import React from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";

export interface ButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    const variantClass =
      variant === "primary"
        ? "btn-primary"
        : variant === "outline"
        ? "btn-outline"
        : "btn-ghost";

    return (
      <button
        ref={ref}
        className={["btn-base", variantClass, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

import React from "react";
import "./button.css";

export const Button = ({
  children,
  className = "",
  variant,
  size = "md",
  ...props
}) => {
  const sizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "btn-md";
  const variantClass =
    variant === "outline"
      ? "btn-outline"
      : variant === "solid"
      ? "btn-solid"
      : "";

  return (
    <button
      className={`btn ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

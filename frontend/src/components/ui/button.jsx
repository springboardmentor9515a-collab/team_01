import React from "react";

// ...existing code...
export const Button = ({ children, className = "", variant, size = "md", ...props }) => {
  let baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (size === "sm") baseClasses += " px-3 py-1 text-sm";
  if (size === "md") baseClasses += " px-4 py-2 text-md";
  if (size === "lg") baseClasses += " px-6 py-3 text-lg";

  if (variant === "outline") baseClasses += " border";
  if (variant === "solid") baseClasses += " bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button; // default export
// ...existing code...
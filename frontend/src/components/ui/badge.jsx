// src/components/ui/badge.jsx
import React from "react";

export const Badge = ({ children, className, ...props }) => {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${className || ""}`}
      {...props}
    >
      {children}
    </span>
  );
};

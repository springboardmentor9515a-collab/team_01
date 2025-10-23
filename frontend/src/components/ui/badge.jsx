// src/components/ui/badge.jsx
import React from "react";
import "./badge.css";

export const Badge = ({ children, className = "", ...props }) => {
  // allow passing semantic classes like "bg-secondary" -> map to badge-secondary
  let mapped = className.replace(/bg-([a-zA-Z-]+)/g, (m, p1) => `badge-${p1}`);
  const roleProps = props.onClick ? { role: "button" } : {};
  return (
    <span className={`badge ${mapped}`} {...roleProps} {...props}>
      {children}
    </span>
  );
};

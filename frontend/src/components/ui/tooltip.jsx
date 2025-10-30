import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import "./tooltip.css";

// export the provider your app expects
export const TooltipProvider = RadixTooltip.Provider;

export const Tooltip = ({ children, ...props }) => (
  <RadixTooltip.Root {...props}>{children}</RadixTooltip.Root>
);

export const TooltipTrigger = RadixTooltip.Trigger;

export const TooltipContent = ({
  children,
  className = "",
  side = "top",
  ...props
}) => (
  <RadixTooltip.Portal>
    <RadixTooltip.Content
      side={side}
      align="center"
      sideOffset={6}
      className={`tooltip-content ${className}`}
      {...props}
    >
      {children}
      <RadixTooltip.Arrow className="fill-current text-gray-900" />
    </RadixTooltip.Content>
  </RadixTooltip.Portal>
);

export const TooltipArrow = RadixTooltip.Arrow;

// default export for compatibility if needed
export default TooltipProvider;

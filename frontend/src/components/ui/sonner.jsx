import React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

// named export used by your imports
export const Toaster = (props) => <SonnerToaster {...props} />;

// re-export toast helper if needed
export const toast = sonnerToast;

// keep default export for compatibility
export default Toaster;
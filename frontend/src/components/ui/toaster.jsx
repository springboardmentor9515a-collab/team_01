import React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

// simple re-export so other files can import { Toaster } and { toast }
export const Toaster = (props) => <SonnerToaster {...props} />;

export const toast = sonnerToast;

export default Toaster;
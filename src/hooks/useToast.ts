import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  return {
    toast: (message: string, options?: { variant?: "default" | "destructive" }) => {
      if (options?.variant === "destructive") {
        sonnerToast.error(message);
      } else {
        sonnerToast.success(message);
      }
    }
  };
};

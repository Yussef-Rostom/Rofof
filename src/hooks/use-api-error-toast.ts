import { toast } from "sonner";

export const useApiErrorToast = () => {
  const showErrorToast = (message: string) => {
    toast.error(message);
  };

  return { showErrorToast };
};

import { toast as sonnerToast } from "@/components/ui/sonner";

function toast({
  title,
  description,
  variant,
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}) {
  const options = { description, duration: 5000 };

  if (variant === "destructive") {
    sonnerToast.error(title, options);
  } else if (variant === "success") {
    sonnerToast.success(title, options);
  } else {
    sonnerToast(title, options);
  }
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };

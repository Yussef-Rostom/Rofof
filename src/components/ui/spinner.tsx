import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Spinner = ({ className, size }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        size ? sizeClasses[size] : "h-8 w-8",
        className
      )}
    />
  );
};

export const FullPageSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-500 animate-in fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20 opacity-75 duration-1000"></div>
          <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
        </div>
        <p className="animate-pulse text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

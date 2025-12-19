
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorComponentProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorComponent({
    title = "Something went wrong",
    message,
    onRetry,
    className,
}: ErrorComponentProps) {
    return (
        <div className={cn("flex min-h-[400px] w-full flex-col items-center justify-center p-4 text-center", className)}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex max-w-md flex-col items-center"
            >
                <div className="relative mb-6 flex items-center justify-center">
                    {/* Decorative background blur */}
                    <div className="absolute inset-0 scale-150 transform rounded-full bg-destructive/10 blur-xl" />

                    {/* Icon wrapper */}
                    <div className="relative rounded-full border border-border bg-background p-4 shadow-sm ring-1 ring-border/50">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                </div>

                <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h3>

                <p className="mb-8 text-muted-foreground leading-relaxed">
                    {message}
                </p>

                {onRetry && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={onRetry}
                            size="lg"
                            className="gap-2 shadow-sm transition-all hover:shadow-md"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

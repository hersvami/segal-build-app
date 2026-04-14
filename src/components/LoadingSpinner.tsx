import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 24,
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 size={size} className="animate-spin text-blue-600 mb-2" />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}

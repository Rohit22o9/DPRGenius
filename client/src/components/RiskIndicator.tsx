import { cn } from "@/lib/utils";

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
  className?: string;
}

export function RiskIndicator({ level, className }: RiskIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block w-4 h-4 rounded-full mr-2",
        {
          "bg-green-500": level === 'low',
          "bg-yellow-500": level === 'medium', 
          "bg-red-500": level === 'high'
        },
        className
      )}
    />
  );
}

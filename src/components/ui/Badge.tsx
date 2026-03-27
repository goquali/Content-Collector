import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "green" | "red" | "yellow";
  className?: string;
  onClick?: () => void;
}

const variants = {
  default: "bg-gray-100 text-gray-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
  yellow: "bg-yellow-50 text-yellow-700",
};

export default function Badge({
  children,
  variant = "default",
  className,
  onClick,
}: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
    >
      {children}
    </span>
  );
}

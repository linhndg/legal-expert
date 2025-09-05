import { cn } from "@/lib/utils";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

// Empty component
export default function Empty({ 
  title = "No data found", 
  description = "", 
  icon,
  className = "" 
}: EmptyProps) {
  return (
    <div className={cn("flex flex-col h-full items-center justify-center py-12", className)}>
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 text-center max-w-sm">{description}</p>}
    </div>
  );
}
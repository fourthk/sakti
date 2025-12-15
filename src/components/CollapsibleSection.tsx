import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        style={{ backgroundColor: isOpen ? "#F3F4F6" : "transparent" }}
      >
        <h3 className="text-lg font-semibold" style={{ color: "#384E66" }}>
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp size={24} style={{ color: "#384E66" }} />
        ) : (
          <ChevronDown size={24} style={{ color: "#384E66" }} />
        )}
      </button>
      
      <div
        className={cn(
          "grid gap-4 mt-4 transition-all duration-300",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;

import {
  ChevronRight,
  Home,
  Folder,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex w-fit items-center gap-1 rounded-full 
                 border border-border/60 
                 bg-background/70 backdrop-blur-md
                 px-3 py-2 shadow-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        // 🔹 Choose default icon based on position
        const Icon =
          index === 0
            ? Home
            : isLast
            ? FileText
            : Folder;

        return (
          <div key={index} className="flex items-center gap-1">
            {!isLast && item.path ? (
              <button
                onClick={() => navigate(item.path!)}
                className="group flex items-center gap-2 px-3 py-1.5
                           rounded-full text-sm font-medium
                           text-muted-foreground
                           transition-all duration-200
                           hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                <span>{item.label}</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-1.5
                           rounded-full text-sm font-semibold
                           bg-primary/10 text-primary
                           shadow-inner"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

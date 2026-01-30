// import { useState } from "react";
// import { TreeNode } from "react-organizational-chart";
// import { BiUpArrow, BiDownArrow } from "react-icons/bi";
// import { Loader2 } from "lucide-react";
// import { useGetChildCategories } from "./hooks";
// import { cn } from "@/lib/utils";

// interface CustomTreeNodeProps {
//   node: any;
// }

// export const CustomTreeNode = ({ node }: CustomTreeNodeProps) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const { data: children = [], isLoading } =
//     useGetChildCategories(node.id, {
//       enabled: isExpanded, 
//     });

//   return (
//     <TreeNode
//       label={
//         <div className="flex justify-center">
//           <div
//             onClick={() => setIsExpanded((prev) => !prev)}
//             className={cn(
//               "group flex items-center gap-2 cursor-pointer",
//               "rounded-xl w-44 px-4 py-2",
//               "border bg-background shadow-sm",
//               "hover:bg-muted transition-all",
//               isExpanded && "ring-1 ring-primary/40"
//             )}
//           >
//             <span className="text-sm font-semibold truncate">
//               {node.categoryname}
//             </span>

//             <span className="flex-1" />

//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//             ) : isExpanded ? (
//               <BiUpArrow className="text-muted-foreground group-hover:text-foreground" />
//             ) : (
//               <BiDownArrow className="text-muted-foreground group-hover:text-foreground" />
//             )}
//           </div>
//         </div>
//       }
//     >
//       {isExpanded &&
//         children.map((child: any) => (
//           <CustomTreeNode key={child.id} node={child} />
//         ))}
//     </TreeNode>
//   );
// };



import { useState } from "react";
import { TreeNode } from "react-organizational-chart";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import { Loader2, Layers } from "lucide-react";
import { useGetChildCategories } from "./hooks";
import { cn } from "@/lib/utils";

interface CustomTreeNodeProps {
  node: any;
}

export const CustomTreeNode = ({ node }: CustomTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: children = [], isLoading } = useGetChildCategories(node.id, {
    enabled: isExpanded,
  });

  return (
    <TreeNode
      label={
        <div className="flex justify-center py-2">
          <div
            onClick={() => setIsExpanded((prev) => !prev)}
            className={cn(
              "group relative flex items-center gap-3 cursor-pointer",
              "w-52 px-4 py-3 rounded-xl border transition-all duration-300",
              "bg-card text-card-foreground shadow-sm",
              "hover:bg-accent hover:border-primary/50 hover:shadow-md",
              isExpanded 
                ? "border-primary/60 ring-4 ring-primary/5 bg-accent/30" 
                : "border-input"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isExpanded ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Layers size={14} />
            </div>

            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter leading-none mb-1">
                Category
              </span>
              <span className="text-sm font-semibold truncate w-full">
                {node.categoryname}
              </span>
            </div>

            <span className="flex-1" />

            <div className="flex items-center justify-center min-w-5">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : isExpanded ? (
                <BiChevronUp className="text-primary size-5" />
              ) : (
                <BiChevronDown className="text-muted-foreground group-hover:text-foreground size-5" />
              )}
            </div>
            
            {isExpanded && (
              <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full shadow-[0_2px_8px_rgba(var(--primary),0.5)]" />
            )}
          </div>
        </div>
      }
    >
      {isExpanded &&
        children.map((child: any) => (
          <CustomTreeNode key={child.id} node={child} />
        ))}
    </TreeNode>
  );
};
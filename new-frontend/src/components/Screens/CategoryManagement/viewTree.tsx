import { useState } from "react";
import { Tree } from "react-organizational-chart";
import { CustomTreeNode } from "./CustomTreeNode";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeViewProps {
  row: any;
}

export const TreeView = ({ row }: TreeViewProps) => {
  const [showTree, setShowTree] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Button
        variant="outline"
        onClick={() => setShowTree((prev) => !prev)}
        className="flex items-center gap-2"
      >
        {showTree ? "Hide Hierarchy" : "View Hierarchy"}
        {showTree ? <ChevronUp /> : <ChevronDown />}
      </Button>

      <div
        className={cn(
          "w-full transition-all duration-300",
          showTree ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {showTree && (
          <div className="w-full max-h-[70vh] overflow-auto rounded-2xl border bg-card p-6 shadow-sm">
            <Tree
              lineWidth="3px"
              lineColor="#22c55e"
              lineBorderRadius="10px"
              label={<CustomTreeNode node={row} />} children={undefined}            />
          </div>
        )}
      </div>
    </div>
  );
};

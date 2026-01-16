import { useState } from "react";
import { Tree } from "react-organizational-chart";
import { CustomTreeNode } from "./CustomTreeNode";
import { Button } from "@/components/ui/button";

interface TreeViewProps {
  row: any;
}

export const TreeView = ({ row }: TreeViewProps) => {
  const [showTree, setShowTree] = useState(false);

  return (
<div className="flex flex-col items-center">
      <Button variant="outline" onClick={() => setShowTree(!showTree)}>
        View Child Hierarchy
      </Button>
      {showTree && (
        <Tree
          lineWidth="2px"
          lineColor="green"
          lineBorderRadius="10px"
          label={<CustomTreeNode node={row} />} children={undefined}        />
      )}
    </div>
  );
};

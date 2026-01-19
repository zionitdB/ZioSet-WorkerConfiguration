import { useState } from "react";
import { TreeNode } from "react-organizational-chart";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import { Loader2 } from "lucide-react";
import { useGetChildCategories } from "./hooks";

interface CustomTreeNodeProps {
  node: any;
}

export const CustomTreeNode = ({ node }: CustomTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: children, isLoading } = useGetChildCategories(node.id)

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <TreeNode
      label={
        <div
          className="cursor-pointer flex items-center space-x-1 text-gray-700 dark:text-gray-200"
          onClick={toggleExpand}
        >
          <span>{node.categoryname}</span>
          {isLoading ? <Loader2 size={16} /> : isExpanded ? <BiUpArrow /> : <BiDownArrow />}
        </div>
      }
    >
      {isExpanded && children?.map((child:any) => <CustomTreeNode key={child.id} node={child} />)}
    </TreeNode>
  );
};

import { useState } from "react";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetParentCategory } from "./hooks";

interface ChildParentViewProps {
  category: any;
}

export const ChildParentView = ({ category }: ChildParentViewProps) => {
  const [viewClicked, setViewClicked] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: number]: boolean }>({});

console.log("categorycategory",category);


  const { data, isLoading } = useGetParentCategory(category?.id)
console.log("datadata",data);

  const toggleNode = (id: number) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
<div className="flex flex-col items-center space-y-2">
      <Button variant="outline" onClick={() => setViewClicked(!viewClicked)}>
        View Parent Hierarchy
      </Button>
      {viewClicked &&
        (isLoading ? (
          <Loader2 />
        ) : data?.parent ? (
          <div className="flex flex-col space-y-1 ml-4">
            <div
              className="cursor-pointer flex items-center space-x-1 text-gray-700 dark:text-gray-200"
              onClick={() => toggleNode(data.parent!.id)}
            >
              <span>{data.parent.categoryname}</span>
              {expandedNodes[data.parent.id] ? <BiDownArrow /> : <BiUpArrow />}
            </div>
          </div>
        ) : (
          <p className="text-red-500">No parent found</p>
        ))}
    </div>
  );
};

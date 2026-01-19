import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TreeView } from "./viewTree";
import { ChildParentView } from "./ChildParentView";

export const TreeViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location?.state?.row||0;
console.log("category",category);

  return (
    <div className="p-4 space-y-6">
      <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
        Category Hierarchy
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate("/agentConfiguration/category")}>
          Go Back
        </Button>
      </div>

      <div>
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Selected Category:
        </span>
        <span className="text-green-500 ml-2">{category?.categoryname}</span>
      </div>

      <Separator />

      <div className="item-center">
        <h3 className="text-center  text-gray-700 dark:text-gray-200 mb-2">Parent Hierarchy</h3>
        <ChildParentView category={category} />
      </div>

      <Separator />

      <div>
        <h3 className="text-center text-gray-700 dark:text-gray-200 mb-2">Child Hierarchy</h3>
        <TreeView row={category} />
      </div>
    </div>
  );
};

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TreeView } from "./viewTree";
import { ChildParentView } from "./ChildParentView";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/common/breadcrumb";

export const TreeViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location?.state?.row || null;

  return (
    <div className=" space-y-6 max-w-7xl mx-auto">
    
         <div className="mb-6">
                <Breadcrumb
                  items={[
                    {
                      label: "Module Dashboard",
                      path: "/app/dashboard",
                    },
                    {
                      label: "Category",
                          path: "/app/agentConfiguration/category",
                    },
                     {
                      label: "Category Hierarchy",
                          path: "/app/agentConfiguration/CategoriesTreeview",
                    },
                  ]}
                />
              </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Category Hierarchy
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize parent and child relationships
          </p>
        </div>
<div></div>
        {/* <Button
          variant="outline"
          onClick={() => navigate("/app/agentConfiguration/category")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button> */}
      </div>

      {/* Selected Category */}
      <div className=" p-4 ">
        <span className="text-sm text-muted-foreground">
          Selected Category
        </span>
        <div className="mt-1 text-lg font-semibold text-green-500">
          {category?.categoryname || "—"}
        </div>
      </div>

      {/* Parent Hierarchy */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Parent Hierarchy
        </h3>
        <Separator />
        <ChildParentView category={category} />
      </div>

      {/* Child Hierarchy */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Child Hierarchy
        </h3>
        <Separator />
        <TreeView row={category} />
      </div>
    </div>
  );
};

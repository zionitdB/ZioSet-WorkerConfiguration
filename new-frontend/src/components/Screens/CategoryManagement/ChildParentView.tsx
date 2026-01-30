import { useState } from "react";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useGetParentCategory } from "./hooks";

interface Node {
  id: number;
  label: string;
}

interface ChildParentViewProps {
  category: {
    id: number;
    categoryname: string;
  };
}

export const ChildParentView = ({ category }: ChildParentViewProps) => {
  const [viewClicked, setViewClicked] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([
    { id: category.id, label: category.categoryname },
  ]);
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});
  const [loadingNodeId, setLoadingNodeId] = useState<number | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  const { refetch } = useGetParentCategory(activeNodeId!);

  const handleExpandCollapse = async (id: number) => {
    if (expandedNodes[id]) {
      setExpandedNodes((prev) => ({ ...prev, [id]: false }));
      const index = nodes.findIndex((n) => n.id === id);
      setNodes((prev) => prev.slice(index));
      return;
    }

    setLoadingNodeId(id);
    setActiveNodeId(id);

    try {
      const { data, isError } = await refetch();

      if (isError) {
        toast.error("Error fetching hierarchy");
        return;
      }

      if (data?.parent) {
        const newNode = {
          id: data.parent.id,
          label: data.parent.categoryname,
        };
        setNodes((prev) => [newNode, ...prev]);
        setExpandedNodes((prev) => ({ ...prev, [id]: true }));
      } else {
        toast("Root reached, no more nodes", { icon: '🏛️' });
      }
    } catch (error) {
      toast.error("Failed to load hierarchy");
    } finally {
      setLoadingNodeId(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full py-4 text-foreground">
      <Button
        variant="outline"
        className="shadow-sm"
        onClick={() => {
          setViewClicked((prev) => !prev);
          setNodes([{ id: category.id, label: category.categoryname }]);
          setExpandedNodes({});
        }}
      >
        {viewClicked ? "Close Hierarchy" : "View Parent Hierarchy"}
      </Button>

      {viewClicked && (
        <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center">
            {nodes.map((node, index) => {
              const isLast = index === nodes.length - 1;
              const isRoot = index === 0;

              return (
                <div key={`${node.id}-${index}`} className="flex flex-col items-center w-full">
            
                  <div
                    onClick={() => handleExpandCollapse(node.id)}
                    className={cn(
                      "group flex items-center justify-between min-w-60 gap-6 cursor-pointer rounded-xl px-5 py-3 transition-all border shadow-sm",
                 
                      isLast 
                        ? "bg-primary text-primary-foreground border-primary hover:opacity-90" 
                        : "bg-background text-foreground border-input hover:border-primary hover:bg-accent",
                      expandedNodes[node.id] && !isLast ? "ring-2 ring-ring/20" : ""
                    )}
                  >
                    <div className="flex flex-col text-left">
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-tight mb-0.5",
                        isLast ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {isLast ? "Current Level" : `Parent Rank ${nodes.length - 1 - index}`}
                      </span>
                      <span className="text-sm font-semibold truncate max-w-40">
                        {node.label}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {loadingNodeId === node.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : !isRoot || expandedNodes[node.id] ? (
                        expandedNodes[node.id] ? <BiDownArrow className="opacity-70" /> : <BiUpArrow className="opacity-70" />
                      ) : (
                        <BiUpArrow className="opacity-30" />
                      )}
                    </div>
                  </div>

                  {!isLast && (
                    <div className="h-10 w-px bg-border relative">
                       <div className="absolute inset-0 bg-linear-to-b from-primary/40 to-transparent w-full" />
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-muted-foreground/30 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
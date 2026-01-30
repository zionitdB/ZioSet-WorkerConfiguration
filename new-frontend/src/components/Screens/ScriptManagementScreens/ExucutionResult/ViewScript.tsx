import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { format } from "date-fns";
import DataTable from "@/components/common/DataTable";
import { useGetExecutionsByScriptId } from "./hooks";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onClose: () => void;
  scriptId: number | null;
  scriptName: string;
}

export default function ScriptExecutionDialog({
  open,
  onClose,
  scriptId,
  scriptName,
}: Props) {
  const { data = [], isLoading } = useGetExecutionsByScriptId(scriptId);

  const columns = useMemo(
    () => [
      { headerName: "Run ID", field: "runUuid", flex: 1.2 },
      { headerName: "Host", field: "hostName", flex: 1 },
      {
        headerName: "Started",
        field: "startedAt",
        flex: 1,
        cellRenderer: (p: any) =>
          p.value ? format(new Date(p.value), "dd MMM yyyy HH:mm") : "-",
      },
      {
        headerName: "Finished",
        field: "finishedAt",
        flex: 1,
        cellRenderer: (p: any) =>
          p.value ? format(new Date(p.value), "dd MMM yyyy HH:mm") : "-",
      },
      {
        headerName: "Result",
        field: "returnCode",
        width: 120,
        cellRenderer: (p: any) => (
          <Badge variant={p.value === 0 ? "default" : "destructive"}>
            {p.value === 0 ? "Success" : "Failed"}
          </Badge>
        ),
      },
      { headerName: "Stdout", field: "stdout", flex: 1.5 },
      { headerName: "Stderr", field: "stderr", flex: 1.5 },
    ],
    []
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden flex flex-col">
      
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            Execution History —{" "}
            <span className="text-primary">{scriptName}</span>
          </DialogTitle>

       
        </DialogHeader>

       <ScrollArea className="h-125">
          <div className="p-4">
            <DataTable
              rowData={data}
              colDefs={columns}
              isLoading={isLoading}
              showPagination={false}
              pagination
              showExportButton={false}
              showRowsPerPage={false}
              showActions={false}
              showFilter={false}
              fileName={`script_${scriptName}_executions`}
              onRowsPerPageChange={undefined}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

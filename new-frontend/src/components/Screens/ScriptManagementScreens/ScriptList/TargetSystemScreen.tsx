import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Smartphone, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";



import { useState } from "react";
import { useDeleteTargetSystem, useGetTargetSystems } from "./hooks";
import Breadcrumb from "@/components/common/breadcrumb";

const ScriptTargetSystemsRoute = () => {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("id") || "";
  const { data, isLoading, refetch } = useGetTargetSystems(uuid);
  const deleteMutation = useDeleteTargetSystem();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        width: 80,
        valueGetter: (params: any) => params.node.rowIndex + 1,
      },
      {
        field: "systemSerialNumber",
        headerName: "Serial Number",
        flex: 1.5,
      },
      {
        field: "isUpdated",
        headerName: "Updated",
        flex: 1,
        cellRenderer: (p: any) =>
          p.value ? (
            <Badge className="gap-1" variant="default">
              <CheckCircle className="h-3 w-3" />
              Yes
            </Badge>
          ) : (
            <Badge className="gap-1" variant="secondary">
              <XCircle className="h-3 w-3" />
              No
            </Badge>
          ),
      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        flex: 1.2,
        cellRenderer: (p: any) =>
          p.value ? format(new Date(p.value), "dd-MM-yyyy HH:mm") : "-",
      },
      {
        headerName: "Action",
        width: 100,
        cellRenderer: (p: any) => (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              setDeleteTargetId(p.data.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  const confirmDelete = () => {
    if (!deleteTargetId) return;

    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        refetch();
        setDeleteDialogOpen(false);
        setDeleteTargetId(null);
      },
    });
  };


  return (
    <div className="container mx-auto py-6 space-y-6">


     <div className="mb-6">
            <Breadcrumb
              items={[
                {
                  label: "Module Dashboard",
                  path: "/dashboard",
                },
                {
                  label: "Script List",
                      path: "/scriptRunner/scriptRunner",
                },
                 {
                  label: "Target Systems",
                      path: "/scriptRunner/scriptTargetSystems",
                },
              ]}
            />
          </div>


      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
             Target Systems
          </h1>
          <p className="text-sm text-muted-foreground break-all">
             ID: {uuid}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
              rowData={data || []}
              colDefs={columnDefs}
              isLoading={isLoading}
              showFilter={false}
              pagination
              showActions={false}
              showPagination ={false}
              onRowsPerPageChange={undefined}      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this target system?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScriptTargetSystemsRoute;

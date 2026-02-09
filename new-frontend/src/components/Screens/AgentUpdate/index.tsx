"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Loader2,
  RefreshCw,
  Smartphone,
  Calendar,
  FileCode,
  Package,
} from "lucide-react";
import CustomModal from "@/components/common/Modal/DialogModal";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  useGetAgentUpdates,
  useDeleteAgent,
  useGetAgentUpdatesByGroupSearch,
  useGetAgentUpdateCountByGroupSearch,
} from "./hooks";
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
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/breadcrumb";

/* ------------------------------------------------ */

const AgentUpdateRoute = () => {
  /* ---------------- STATE ---------------- */
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  // 🔍 GROUP SEARCH
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  const router = useNavigate();

  /* ---------------- API ---------------- */
  const { data, isLoading, refetch, isFetching } =
    useGetAgentUpdates(page, rowsPerPage);

  const deleteMutation = useDeleteAgent();

  const groupSearch = useGetAgentUpdatesByGroupSearch();
  const groupSearchCount = useGetAgentUpdateCountByGroupSearch();

  /* ---------------- DATA SOURCE ---------------- */
  const tableData = useMemo(
    () => (filteredData.length ? filteredData : data || []),
    [filteredData, data]
  );

  const totalItems = isSearchActive ? searchCount : data?.length || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  /* ---------------- EXPORT ---------------- */
  const exportPayload = useMemo(
    () => ({
      columns: filterColumns,
      pageNo: 1,
      perPage: isSearchActive ? searchCount : totalItems,
    }),
    [filterColumns, isSearchActive, searchCount, totalItems]
  );

  const getAllAgentUpdates = useGetAgentUpdates(1, exportPayload.perPage);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise((resolve, reject) => {
        groupSearch.mutate(exportPayload, {
          onSuccess: (d: any) => resolve(d || []),
          onError: reject,
        });
      });
    }

    return new Promise((resolve, reject) => {
      getAllAgentUpdates
        .refetch()
        .then((res: any) => resolve(res.data || []))
        .catch(reject);
    });
  };

  /* ---------------- GROUP SEARCH ---------------- */
  const handleGroupSearch = (filters: Record<string, any>) => {
     
     console.log("filters",filters);
     
    const hasFilters = Object.values(filters).some(
      (f) => f.filter && f.filter.trim() !== ""
    );

    if (!hasFilters) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = {
      columns: Object.entries(filters).map(([key, value]) => ({
        columnName: key,
        value: value.filter,
      })),
      pageNo: page,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);

    groupSearch.mutate(payload, {
      onSuccess: (data) => setFilteredData(data || []),
    });

    groupSearchCount.mutate(payload, {
      onSuccess: (count) => setSearchCount(count || 0),
    });
  };

  useEffect(() => {
    if (!isSearchActive || !filterColumns.length) return;

    const payload = {
      columns: filterColumns,
      pageNo: page,
      perPage: rowsPerPage,
    };

    groupSearch.mutate(payload, {
      onSuccess: (d: any) => setFilteredData(d || []),
    });
  }, [page, rowsPerPage]);

  /* ---------------- TABLE COLUMNS ---------------- */
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (p: any) =>
          (page - 1) * rowsPerPage + (p.node.rowIndex + 1),
        width: 80,
        filter: false,
      },
      {
        field: "uuid",
        headerName: "UUID",
        flex: 1.5,
        cellClass: "font-mono text-xs",

      },
      {
        field: "targetDateTime",
        headerName: "Target Time",
        flex: 1,
          filter: false,
        cellRenderer: (p: any) =>
          p.value ? format(new Date(p.value), "dd-MM-yyyy HH:mm") : "-",
      },
      {
        field: "files",
        headerName: "Files",
          filter: false,
        flex: 1.2,
        cellRenderer: (p: any) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <FileCode className="h-3 w-3" />
              {p.value?.length || 0} Files
            </Badge>
            {p.value?.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-primary"
                onClick={() => {
                  setSelectedFiles(p.value);
                  setFilesModalOpen(true);
                }}
              >
                View
              </Button>
            )}
          </div>
        ),
      },
      {
        field: "targetSystemsCount",
        headerName: "Target Systems",
          filter: false,
        flex: 1.2,
        cellRenderer: (p: any) => (
          <Button
            variant="link"
            className="flex items-center gap-1 px-0 text-primary"
            onClick={() =>
              router(`/app/agentInstallation/targetSystems?uuid=${p.data.uuid}`)
            }
          >
            <Smartphone className="h-4 w-4" />
            {p.value} Systems
          </Button>
        ),
      },
      {
        field: "createdAt",
        headerName: "Created At",
          filter: false,
        flex: 1,
        cellRenderer: (p: any) =>
          p.value ? format(new Date(p.value), "dd-MM-yyyy HH:mm") : "-",
      },
    ],
    [page, rowsPerPage]
  );

  /* ---------------- DELETE ---------------- */
  const handleDelete = (data: any) => {
    setDeleteTarget(data);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        refetch();
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto py-6 space-y-6">
     <div className="mb-6">
            <Breadcrumb
              items={[
                {
                  label: "Module Dashboard",
                  path: "/app/dashboard",
                },
                {
                  label: "Agent Update",
                      path: "/app/agentInstallation/agentUpdate",
                },
              ]}
            />
          </div>
          
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="text-primary">Agent</span> Updates
            </h1>
            <p className="text-sm text-muted-foreground">Schedule and monitor remote agent configurations</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap items-center gap-3">
          <StatItem icon={<Package className="h-4 w-4 text-primary" />} label="Total" value={tableData.length} />
          <StatItem icon={<Calendar className="h-4 w-4 text-orange-500" />} label="Scheduled" value={tableData.length} color="text-orange-500" />
          {/* <StatItem icon={<CheckCircle className="h-4 w-4 text-green-600" />} label="Success" value={0} color="text-green-600" /> */}
        </div>
      </div>

      <DataTable
        rowData={tableData}
        colDefs={columnDefs}
        isLoading={isLoading}
        onAddClick={() =>
          router("/app/agentInstallation/agentUpdateForm")
        }
        showEdit={false}
        onDeleteClick={handleDelete}
        showExportButton
        allData={allDataForExport}
        fileName="agent-updates"
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        addComponent={
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
            className="gap-2"
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        }
      />

      {/* FILE MODAL */}
      <CustomModal
        isOpen={filesModalOpen}
        onClose={() => setFilesModalOpen(false)}
        dialogTitle="Configuration Files"
        width="max-w-3xl"
      >
        {selectedFiles.map((file, i) => (
          <div key={i} className="p-3 border rounded-lg mb-2">
            <p className="font-semibold">{file.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {file.updateTypeLabel}
            </p>
          </div>
        ))}
      </CustomModal>

      {/* DELETE CONFIRM */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
const StatItem = ({ icon, label, value, color = "text-foreground" }: any) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border">
    {icon}
    <div className="text-left">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  </div>
);
export default AgentUpdateRoute;

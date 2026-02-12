

import { useState, useMemo, useEffect } from "react";
import { 
  Loader2, RefreshCw, Terminal, CheckCircle2, XCircle, Activity, 
  Smartphone
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
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

import {
  useGetScripts,
  useGetScriptCount,
  useDeleteScript,
  useGetScriptsByGroupSearch,
  useGetScriptCountByGroupSearch,
  useUpdateScriptEnabled,
  useUpdateScriptDisabled,
} from "./hooks";
import { useNavigate } from "react-router-dom";

const ScriptListRoute = () => {
  const router = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: rowData, isLoading, refetch, isFetching } = useGetScripts(page, rowsPerPage);
  const { data: scriptCount } = useGetScriptCount();

  const deleteMutation = useDeleteScript();
  const getScriptsByGroupSearch = useGetScriptsByGroupSearch();
  const getScriptCountByGroupSearch = useGetScriptCountByGroupSearch();

  const serviceData = useMemo(() => (filteredData.length ? filteredData : rowData || []), [filteredData, rowData]);
  const totalItems = isSearchActive ? searchDataCount : scriptCount || serviceData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const stats = useMemo(() => {
    const active = serviceData.filter((s: any) => s.isActive === true).length;
    const inactive = serviceData.filter((s: any) => s.isActive !== true).length;
    return { active, inactive };
  }, [serviceData]);


const updateEnabledMutation = useUpdateScriptEnabled();
const updateDisabledMutation = useUpdateScriptDisabled();

const handleToggleStatus = (data: any) => {
  const updatedData = {
    ...data,
  isActive: data.isActive === true ? false : true

  };

  if (data.isActive === true) {
    updateDisabledMutation.mutate(updatedData);
  } else {
    updateEnabledMutation.mutate(updatedData);
  }
};


  const columnDefs = useMemo(() => [
    {
      headerName: "Sr No",
      valueGetter: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
      width: 80,
      filter:false,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "scriptType", headerName: "Script Type", flex: 1 },
   {
  field: "isActive",
  headerName: "Status",
  filter: false,
  flex: 1,
  cellRenderer: (params: any) => {
    const isActive = params.data?.isActive;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
          ${isActive
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-700 border border-red-200"}
        `}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  },
},
    
   { 
  field: "targetSystemsCount", 
  headerName: "Target Systems", 
  flex: 1.2,
  cellRenderer: (p: any) => (
    <Button
      variant="link"
      className="flex items-center gap-1 px-0 text-primary"
      onClick={() =>
        router(`/app/scriptRunner/scriptTargetSystems?id=${p.data.id}`)
      }
    >
      <Smartphone className="h-4 w-4" />
      {p.value} Target Systems
    </Button>
  )
},
    {
      headerName: "Action",
       filter:false,
      width: 100,
      cellRenderer: (params: any) => (
     <Button
        size="sm"
        className={`min-w-30 flex items-center mt-2 gap-2 ${
          params.data.isActive 
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
       onClick={() => handleToggleStatus(params.data)}
      >
        {params.data.isActive  ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        {params.data.isActive  ? "Active" : "Inactive"}
      </Button>

      ),
    },
  ], [page, rowsPerPage]);

  const handleGroupSearch = (filters: Record<string, any>) => {
    const hasFilters = Object.values(filters).some((f) => f.filter && f.filter.trim() !== "");
    if (!hasFilters) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = {
      columns: Object.entries(filters).map(([key, value]) => ({ columnName: key, value: value.filter })),
      pageNo: page,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);

    getScriptsByGroupSearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    getScriptCountByGroupSearch.mutate(payload, { onSuccess: (count) => setSearchDataCount(count || 0) });
  };

  useEffect(() => {
    if (isSearchActive && filterColumns?.length) {
      const payload = { columns: filterColumns, pageNo: page, perPage: rowsPerPage };
      getScriptsByGroupSearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    }
  }, [page, rowsPerPage]);

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          refetch();
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <div className="container mx-auto  space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="text-primary">Script</span> List
            </h1>
            <p className="text-sm text-muted-foreground">Manage scripts and automation tasks</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <Activity className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total Scripts</p>
              <p className="text-lg font-bold">{totalItems}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 rounded-lg border border-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 rounded-lg border border-red-500/10">
            <XCircle className="h-4 w-4 text-red-600" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-lg font-bold text-red-600">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={isLoading}
        // onAddClick={() => router("/agentManagement/app/scriptRunner")}
        onDeleteClick={(data) => { setDeleteTarget(data); setDeleteDialogOpen(true); }}
        showEdit={false}
        showDelete
        showPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        fileName="script"
        addComponent={
          <Button onClick={() => refetch()} disabled={isFetching} variant="outline" className="gap-2">
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
          </Button>
        }
        showFilter={false}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg"><XCircle className="h-6 w-6 text-destructive" /></div>
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2">
              Are you sure you want to delete <span className="font-bold text-foreground">{deleteTarget?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScriptListRoute;
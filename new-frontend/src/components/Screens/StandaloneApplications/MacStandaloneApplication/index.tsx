"use client";

import { useState, useMemo, useEffect } from "react";
import { Loader2, RefreshCw, Layers, CheckCircle2, XCircle} from "lucide-react";
import CustomModal from "@/components/common/Modal/DialogModal";
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
  useGetStandaloneApps,
  useGetStandaloneAppCount,
  useAddStandaloneApp,
  useUpdateStandaloneApp,
  useDeleteStandaloneApp,
  useGetStandaloneAppsByGroupSearch,
  useGetStandaloneAppCountByGroupSearch,
} from "./hooks";
import StandaloneAppForm from "./form";

const MacStandaloneAppRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>("");
  const [Id, setId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: rowData, isLoading, refetch, isFetching } = useGetStandaloneApps(page, rowsPerPage);
  const { data: totalCount,refetch:refetchCount } = useGetStandaloneAppCount();

  const addMutation = useAddStandaloneApp();
  const updateMutation = useUpdateStandaloneApp();
  const deleteMutation = useDeleteStandaloneApp();
  const getAppsBySearch = useGetStandaloneAppsByGroupSearch();
  const getCountBySearch = useGetStandaloneAppCountByGroupSearch();

  const serviceData = useMemo(() => (filteredData.length ? filteredData : rowData || []), [filteredData, rowData]);
  const totalItems = isSearchActive ? searchDataCount : totalCount || serviceData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const stats = useMemo(() => {
    const active = serviceData.filter((app: any) => app.active === 1).length;
    const inactive = serviceData.filter((app: any) => app.active !== 1).length;
    return { active, inactive };
  }, [serviceData]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Sr No",
      valueGetter: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
      width: 100,
      filter:false
    },
    { field: "standaloneApplicationName", headerName: "Application Name", flex: 1 },
    { 
        field: "addedDate", 
        headerName: "Added Date", 
        flex: 1,
          filter: false,
        cellRenderer: (params: any) => params.data.addedDate ? new Date(params.data.addedDate).toLocaleDateString() : "-"
    },

{
  field: "active",
  headerName: "Status",
  width: 170,
  filter: false,
  cellRenderer: (params: any) => {
    const isActive = params.data.active === 1;

    return (
      <Button
        size="sm"
        className={`min-w-30 flex mt-2 items-center gap-2 ${
          isActive
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
        onClick={() => {
          updateMutation.mutate(
            {
              ...params.data,
              active: params.data.active ,
            },
            {
              onSuccess: () => refetch(),
            }
          );
        }}
      >
        {isActive ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        {isActive ? "Active" : "Inactive"}
      </Button>
    );
  },
}


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
    getAppsBySearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    getCountBySearch.mutate(payload, { onSuccess: (count) => setSearchDataCount(count || 0) });
  };

  useEffect(() => {
    if (isSearchActive && filterColumns?.length) {
      const payload = { columns: filterColumns, pageNo: page, perPage: rowsPerPage };
      getAppsBySearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    }
  }, [page, rowsPerPage]);



  
    const transformData = (data: any[]) =>
      data.map((item) => ({
        ...item,
     active: item?.active === 1 ? "Active" : "Inactive",
      }));
  
    const exportPayload = useMemo(
      () => ({
        columns: filterColumns,
        pageNo: 1,
        perPage: isSearchActive ? searchDataCount : totalItems,
      }),
      [filterColumns, isSearchActive, searchDataCount, totalItems]
    );
  
    const getAllData = useGetStandaloneApps(1, exportPayload.perPage);
  
    const allDataForExport = async (): Promise<any[]> => {
      if (isSearchActive) {
        return new Promise<any[]>((resolve, reject) => {
          getAppsBySearch.mutate(exportPayload, {
            onSuccess: (data) => resolve(transformData(data)),
            onError: reject,
          });
        });
      } else {
        return new Promise<any[]>((resolve, reject) => {
          getAllData
            .refetch()
            .then((res: any) => resolve(transformData(res.data || [])))
            .catch((err: any) => reject(err));
        });
      }
    };



  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
               Mac  <span className="text-primary">Standalone Applications</span>
            </h1>
            <p className="text-sm text-muted-foreground">Manage and monitor standalone software instances</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <Layers className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total</p>
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
        </div>
      </div>

      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={isLoading}
        addComponent={
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
          </Button>
        }
        onAddClick={() => { setEditData(""); setId(null); setIsModalOpen(true); }}
        onEditClick={(data) => { setEditData(data); setId(data.id); setIsModalOpen(true); }}
        onDeleteClick={(data) => { setDeleteTarget(data); setDeleteDialogOpen(true); }}
        showEdit={false}
         showDelete
          showExportButton
           showPagination
        page={page} totalPages={totalPages} setPage={setPage}
        rowsPerPage={rowsPerPage} onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}

        fileName="Standalone_Applications"
        allData={allDataForExport}
      />

      <CustomModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        dialogTitle={Id ? "Edit Application" : "Add Application"}
        formId="app-form" width="max-w-2xl"
      >
        <StandaloneAppForm onSubmit={(data) => {
          if (Id) updateMutation.mutate({ ...data, id: Id }, { onSuccess: () => refetch() });
          else addMutation.mutate(data, { onSuccess: () => refetch() });
          setIsModalOpen(false);
        }} formId="app-form" defaultValues={editData} />
      </CustomModal>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.applicationName}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              deleteMutation.mutate(deleteTarget, { onSuccess: () => { refetch(); refetchCount(); setDeleteDialogOpen(false); } });
            }} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MacStandaloneAppRoute;
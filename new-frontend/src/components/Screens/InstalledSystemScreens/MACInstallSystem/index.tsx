

import { useState, useMemo, useEffect, SetStateAction } from "react";
import { Loader2, RefreshCw, Apple, CheckCircle2, XCircle, ShieldCheck, FileUp, Trash2, AlertCircle } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  useBulkDeleteByExcel,
    useBulkDeleteBySelection,
    useGetMacInstalledSystems, 
    useSearchMacSystems, 
    useSearchMacSystemsCount
} from "./hooks";
import { Input } from "@/components/ui/input";

const MacInstalledSystemsRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isConfirmSelectionOpen, setIsConfirmSelectionOpen] = useState(false);
  
  
  const user: any =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
  
  const deletedById = user?.userId?.toString() || "1";


  const bulkExcelDelete = useBulkDeleteByExcel();
  const bulkSelectionDelete = useBulkDeleteBySelection();
  
  const { data: rowData, isLoading, refetch, isFetching } = useGetMacInstalledSystems(page,rowsPerPage);
  
  // Mutation for Group Search
  const searchMutation = useSearchMacSystems();
    const searchMutationCount = useSearchMacSystemsCount();
    const macCount = useSearchMacSystemsCount();
const serviceData = useMemo(
  () => (filteredData.length ? filteredData : rowData || []),
  [filteredData, rowData]
);

// const totalItems: number = isSearchActive
//   ? Number(searchDataCount ?? 0)
//   : Number(macCount ?? serviceData.length);

const totalItems = useMemo(() => {
  if (isSearchActive) {
    return searchDataCount ?? 0;
  }
  return  serviceData.length ?? 0;
}, [isSearchActive, searchDataCount, macCount, serviceData.length]);



const totalPages = Math.ceil(totalItems / rowsPerPage);


  // Stats calculation
  const stats = useMemo(() => {
    const installed = serviceData.filter((item: any) => item.installed === true).length;
    return { installed, pending: totalItems - installed };
  }, [serviceData, totalItems]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Sr No",
      valueGetter: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
      width: 80,
      filter: false,
    },
    { field: "systemSerialNo", headerName: "Serial Number", flex: 1 },
    {
      field: "installed",
      headerName: "Is Installed",
      width: 140,
      cellRenderer: (params: any) => {
        const isTrue = params.data.installed === true;
        return (
     
          <Badge
  variant="outline"
  className={`gap-1 border ${
    isTrue
      ? "border-green-500 text-green-600 bg-green-500/10"
      : "border-red-500 text-red-600 bg-red-500/10"
  }`}
>
  {isTrue ? (
    <CheckCircle2 className="h-3 w-3" />
  ) : (
    <XCircle className="h-3 w-3" />
  )}
  {isTrue ? "True" : "False"}
</Badge>

        );
      },
    },
    { 
        field: "installReqAt", 
        headerName: "Install Req. At", 
        flex: 1,
        cellRenderer: (params: any) => params.value ? params.value.replace('T', ' ') : "-" 
    },
    { 
        field: "installedAt", 
        headerName: "Installed At", 
        flex: 1,
        cellRenderer: (params: any) => params.value ? params.value.replace('T', ' ') : "-" 
    },
    { 
        field: "installationResponse", 
        headerName: "Response", 
        flex: 1.5,
        cellRenderer: (params: any) => params.value || "No Response"
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

    searchMutation.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    searchMutationCount.mutate(payload, { onSuccess: (count) => setSearchDataCount(count || 0) });
  };

  useEffect(() => {
    if (isSearchActive && filterColumns?.length) {
      const payload = { columns: filterColumns, pageNo: page, perPage: rowsPerPage };
      searchMutation.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    }
  }, [page, rowsPerPage]);


    
    const transformData = (data: any[]) =>
      data.map((item) => ({
        ...item,
      }));
  
    const exportPayload = useMemo(
      () => ({
        columns: filterColumns,
        pageNo: 1,
        perPage: isSearchActive ? searchDataCount : totalItems,
      }),
      [filterColumns, isSearchActive, searchDataCount, totalItems]
    );
  
    const getAllData = useGetMacInstalledSystems(1, exportPayload.perPage);
  
    const allDataForExport = async (): Promise<any[]> => {
      if (isSearchActive) {
        return new Promise<any[]>((resolve, reject) => {
          searchMutation.mutate(exportPayload, {
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



  
  const handleBulkSelectionDelete = () => {
    if (selectedRows.length === 0) return;

    const serialNumbers = selectedRows.map((row) => row.systemSerialNo);
    const payload = {
      serialNumbers,
      deletedById: String(deletedById)
    };

    bulkSelectionDelete.mutate(payload, {
      onSuccess: () => {
        setIsConfirmSelectionOpen(false)
        setSelectedRows([]);
        refetch();
      },
    });
  };

  const handleExcelSubmit = () => {
    if (!uploadFile) return;
console.log("uploadFile",uploadFile);

    const formData = new FormData();
    formData.append("file", uploadFile);

    bulkExcelDelete.mutate({ formData, deletedById }, {
      onSuccess: () => {
        setIsExcelModalOpen(false);
        setUploadFile(null);
        refetch();
      },
    });
  };


  

  const addComponent = (

    <div>
   {/* Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} 
            Refresh
          </Button>

          {selectedRows.length > 0 && (
            <Button variant="destructive"
             size="sm"
              onClick={() => setIsConfirmSelectionOpen(true)}
               disabled={bulkSelectionDelete.isPending} 
               className="gap-2 animate-in fade-in zoom-in duration-200">
              {bulkSelectionDelete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsExcelModalOpen(true)} className="gap-2 border-primary text-primary hover:bg-primary/5">
            <FileUp className="h-4 w-4" /> Bulk Excel Delete
          </Button>
        </div>

    </div>
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
           <div className="p-2.5 bg-primary/10 rounded-xl">
            <Apple className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Installed Systems <span className="text-primary">- MAC OS</span>
            </h1>
            <p className="text-sm text-muted-foreground">Comprehensive list of Apple system deployments</p>
          </div>
        </div>

        {/* Quick Stats Inline */}
        <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">{stats.installed} Installed</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-4 bg-primary/10 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-sm font-semibold">{totalItems} Total</span>
            </div>
        </div>
      </div>

      {/* Main Table Section */}
      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={isLoading}
        addComponent={addComponent }
        showEdit={false}
        showDelete={false}
           showCheckbox={true}
                onRowSelection={(rows: SetStateAction<any[]>) => setSelectedRows(rows)}
               
                
        showExportButton
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        fileName="MAC_Installed_Systems"
        allData={allDataForExport}
        showFilter={true}
        showActions={false}
      />


      
      {/* Excel Upload Modal */}
      <Dialog open={isExcelModalOpen} onOpenChange={setIsExcelModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              Upload Excel for Deletion
            </DialogTitle>
            <DialogDescription>
              Select an .xlsx or .csv file. Systems with matching serial numbers in the file will be removed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 bg-muted/30">
            <Input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="max-w-70 bg-background"
            />
            {uploadFile && (
              <p className="text-xs text-green-600 font-medium">Selected: {uploadFile.name}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsExcelModalOpen(false)}>Cancel</Button>
            <Button 
              disabled={!uploadFile || bulkExcelDelete.isPending} 
              onClick={handleExcelSubmit}
            >
              {bulkExcelDelete.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Systems
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>




      <Dialog open={isConfirmSelectionOpen} onOpenChange={setIsConfirmSelectionOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Selection Delete
            </DialogTitle>
            <DialogDescription>
              You are about to delete <strong>{selectedRows.length}</strong> selected systems. Proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmSelectionOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              disabled={bulkSelectionDelete.isPending} 
              onClick={handleBulkSelectionDelete}
            >
              {bulkSelectionDelete.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default MacInstalledSystemsRoute;
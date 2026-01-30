import { useState, useMemo, SetStateAction } from "react";
import {
  Loader2,
  RefreshCw,
  MonitorDot,
  CheckCircle2,
  XCircle,
  Trash2,
  FileUp,
  AlertCircle,
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetInstalledSystems,
  useGetInstalledSystemsAll,
  useGetInstalledSystemsCount,
  useSearchInstalledSystems,
  useSearchInstalledSystemsCount,
  useBulkDeleteByExcel,
  useBulkDeleteBySelection,
} from "./hooks";

interface User {
  userId?: string | number;
}

const WindowInstalledSystemsRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate] = useState("");
  const [endDate] = useState("");

  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isConfirmSelectionOpen, setIsConfirmSelectionOpen] = useState(false);

  const user: User | null =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const deletedById = user?.userId?.toString() || "1";

  const {
    data: allInstallData,
    isLoading: isAllLoading,
    refetch: refetchAll,
  } = useGetInstalledSystemsAll();
  const {
    data: rowData,
    isLoading: isFilterLoading,
    refetch: refetchFiltered,
    isFetching,
  } = useGetInstalledSystems(page, rowsPerPage);
  const { data: totalCount } = useGetInstalledSystemsCount(startDate, endDate);

  const getSearchData = useSearchInstalledSystems();
  const getSearchCount = useSearchInstalledSystemsCount();

  const bulkExcelDelete = useBulkDeleteByExcel();
  const bulkSelectionDelete = useBulkDeleteBySelection();

  const isDateFilterApplied = startDate !== "" && endDate !== "";
  const loading = isDateFilterApplied ? isFilterLoading : isAllLoading;

  const refetchData = () => {
    refetchAll();
    refetchFiltered();
  };

  const handleBulkSelectionDelete = () => {
    if (selectedRows.length === 0) return;

    const serialNumbers = selectedRows.map((row) => row.systemSerialNo);
    const payload = {
      serialNumbers,
      deletedById: String(deletedById),
    };

    bulkSelectionDelete.mutate(payload, {
      onSuccess: () => {
        setSelectedRows([]);
        refetchData();
        setIsConfirmSelectionOpen(false)
      },
    });
  };

  const handleExcelSubmit = () => {
    if (!uploadFile) return;
    console.log("uploadFile", uploadFile);

    const formData = new FormData();
    formData.append("file", uploadFile);

    bulkExcelDelete.mutate(
      { formData, deletedById },
      {
        onSuccess: () => {
          setIsExcelModalOpen(false);
          setUploadFile(null);
          refetchData();
        },
      }
    );
  };

  const serviceData = useMemo(() => {
    if (filteredData.length > 0) return filteredData;
    if (isDateFilterApplied) return rowData || [];
    return allInstallData || [];
  }, [filteredData, isDateFilterApplied, rowData, allInstallData]);

  const totalItems = useMemo(() => {
    if (isSearchActive) return searchDataCount;
    if (isDateFilterApplied) return totalCount || 0;
    return allInstallData?.length || 0;
  }, [
    isSearchActive,
    searchDataCount,
    isDateFilterApplied,
    totalCount,
    allInstallData,
  ]);

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        cellRenderer: (params: any) =>
          (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
        
        width: 80,
        filter: false,
      },
      {
        field: "systemSerialNo",
        headerName: "Serial Number",
        flex: 1,
        //  checkboxSelection: true, headerCheckboxSelection: true
      },
      {
        field: "installed",
        headerName: "Is Installed",
        filter: false,
        width: 140,
        cellRenderer: (params: any) => {
          const installed = params.data.installed === true;
          return (
            <Badge
              variant="outline"
              className={`gap-1 border ${
                installed
                  ? "border-green-500 text-green-600 bg-green-500/10"
                  : "border-red-500 text-red-600 bg-red-500/10"
              }`}
            >
              {installed ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {installed ? "True" : "False"}
            </Badge>
          );
        },
      },
        { 
        field: "installReqAt", 
            filter: false,
        headerName: "Install Req. At", 
        flex: 1,
        cellRenderer: (params: any) => params.value ? params.value.replace('T', ' ') : "-" 
    },
    { 
        field: "installedAt", 
            filter: false,
        headerName: "Installed At", 
        flex: 1,
        cellRenderer: (params: any) => params.value ? params.value.replace('T', ' ') : "-" 
    },
      { field: "installationResponse", headerName: "Response", flex: 1.5 },
    ],
    [page, rowsPerPage]
  );

  const handleGroupSearch = (filters: Record<string, any>) => {
    const hasFilters = Object.values(filters).some(
      (f) => f.filter && f.filter.trim() !== ""
    );
    if (!hasFilters) {
      setFilteredData([]);
      setIsSearchActive(false);
      return;
    }

    const payload = {
      columns: Object.entries(filters).map(([key, value]) => ({
        columnName: key,
        value: value.filter,
      })),
      startDate,
      endDate,
      pageNo: page,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);
    getSearchData.mutate(payload, {
      onSuccess: (data) => setFilteredData(data),
    });
    getSearchCount.mutate(payload, {
      onSuccess: (count) => setSearchDataCount(count || 0),
    });
  };

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

  const getAllData = useGetInstalledSystems(1, exportPayload.perPage);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise<any[]>((resolve, reject) => {
        getSearchData.mutate(exportPayload, {
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

  const addComponent = (
    <div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => refetchData()}
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

        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsConfirmSelectionOpen(true)}
            disabled={bulkSelectionDelete.isPending}
            className="gap-2 animate-in fade-in zoom-in duration-200"
          >
            {bulkSelectionDelete.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete Selected ({selectedRows.length})
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExcelModalOpen(true)}
          className="gap-2 border-primary text-primary hover:bg-primary/5"
        >
          <FileUp className="h-4 w-4" /> Bulk Excel Delete
        </Button>
      </div>
    </div>
  );
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <MonitorDot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Installed Systems
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage installations and bulk deletions
            </p>
          </div>
        </div>
      </div>
{/* 
      <div className="flex flex-wrap items-end gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <div className="grid gap-1.5">
          <Label className="text-xs font-bold text-muted-foreground uppercase">
            Start Date
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 w-40"
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs font-bold text-muted-foreground uppercase">
            End Date
          </Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 w-40"
          />
        </div>
        <Button
          onClick={() => refetchFiltered()}
          disabled={!startDate || !endDate}
          className="h-9 gap-2"
        >
          <CalendarDays className="h-4 w-4" /> Filter
        </Button>
        {(startDate || endDate) && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredData([]);
            }}
          >
            Reset
          </Button>
        )}
      </div> */}

      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={loading}
        addComponent={addComponent}
        showCheckbox={true}
        onRowSelection={(rows: SetStateAction<any[]>) => setSelectedRows(rows)}
        showEdit={false}
        showDelete={false}
        showFilter={true}
        showActions={false}
        showExportButton
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        fileName="Installed_Systems_Windows"
        allData={allDataForExport}
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
              Select an .xlsx or .csv file. Systems with matching serial numbers
              in the file will be removed.
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
              <p className="text-xs text-green-600 font-medium">
                Selected: {uploadFile.name}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsExcelModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!uploadFile || bulkExcelDelete.isPending}
              onClick={handleExcelSubmit}
            >
              {bulkExcelDelete.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Systems
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isConfirmSelectionOpen}
        onOpenChange={setIsConfirmSelectionOpen}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Selection Delete
            </DialogTitle>
            <DialogDescription>
              You are about to delete <strong>{selectedRows.length}</strong>{" "}
              selected systems. Proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsConfirmSelectionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={bulkSelectionDelete.isPending}
              onClick={handleBulkSelectionDelete}
            >
              {bulkSelectionDelete.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WindowInstalledSystemsRoute;

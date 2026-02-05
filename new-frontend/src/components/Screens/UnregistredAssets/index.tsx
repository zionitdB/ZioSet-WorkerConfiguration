

import { useState, useMemo, useEffect } from "react";
import {
  Loader2,
  RefreshCw,
  MonitorX,
  AlertTriangle,
} from "lucide-react";

import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/breadcrumb";
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

import {
  useGetUnregisteredAssets,
  useDeleteUnregisteredAsset,
  useSearchUnregisteredAssets,
  useSearchUnregisteredCount,
} from "./hooks";



const UnregisteredAssetsRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);


  const {
    data: rowData,
    isLoading,
    refetch,
    isFetching,
  } = useGetUnregisteredAssets(page, rowsPerPage);

  const deleteMutation = useDeleteUnregisteredAsset();
  const searchMutation = useSearchUnregisteredAssets();
  const searchCountMutation = useSearchUnregisteredCount();

  const tableData = useMemo(
    () => (filteredData.length ? filteredData : rowData || []),
    [filteredData, rowData]
  );

  const totalItems = isSearchActive
    ? searchDataCount
    : rowData?.totalCount || rowData?.length || 0;

  const totalPages = Math.ceil(totalItems / rowsPerPage);


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
        field: "systemSerialNumber",
        headerName: "Serial Number",
        flex: 1,
      },
      {
        field: "computerName",
        headerName: "Computer Name",
        flex: 1,
      },
      {
        field: "operatingSystem",
        headerName: "OS",
        width: 150,
        cellRenderer: (p: any) => (
          <Badge variant="outline" >
            {p.value}
          </Badge>
        ),
      },
      {
        field: "addedDateTime",
              filter: false,
        headerName: "Added At",
        flex: 1,
        cellRenderer: (p: any) =>
          p.value ? p.value.split("T")[0] : "-",
      },
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
      setPage(1);
      return;
    }

    const payload = {
      columns: Object.entries(filters).map(([key, value]) => ({
        columnName: key,
        value: value.filter,
      })),
      pageNo: 1,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);
    setPage(1);

    searchMutation.mutate(payload, {
      onSuccess: (data: any) => setFilteredData(data || []),
    });

    searchCountMutation.mutate(payload, {
      onSuccess: (count: number) =>
        setSearchDataCount(count || 0),
    });
  };


  useEffect(() => {
    if (!isSearchActive || !filterColumns.length) return;

    const payload = {
      columns: filterColumns,
      pageNo: page,
      perPage: rowsPerPage,
    };

    searchMutation.mutate(payload, {
      onSuccess: (data: any) => setFilteredData(data || []),
    });
  }, [page, rowsPerPage]);



    const getAllData = useGetUnregisteredAssets(1, totalItems||10000);


  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      const payload = {
        columns: filterColumns,
        pageNo: 1,
        perPage: searchDataCount,
      };

      return new Promise((resolve, reject) => {
        searchMutation.mutate(payload, {
          onSuccess: (data: any) => resolve(data || []),
          onError: reject,
        });
      });
    }

    return new Promise((resolve, reject) => {
     getAllData
        .refetch()
        .then((res: any) => resolve(res.data || []))
        .catch(reject);
    });
  };


  const confirmDelete = () => {
    deleteMutation.mutate(deleteTarget.systemSerialNumber, {
      onSuccess: () => {
        refetch();
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Module Dashboard", path: "/app/dashboard" },
          { label: "Unregistered Assets" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <MonitorX className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Unregistered <span className="text-primary">Assets</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSearchActive
                ? `Found ${searchDataCount} matching assets`
                : "Managing assets pending registration"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs uppercase font-semibold text-primary">
              Total
            </p>
            <p className="text-lg font-bold">{totalItems}</p>
          </div>
        </div>
      </div>

      <DataTable
        rowData={tableData}
        colDefs={columnDefs}
        isLoading={isLoading}
        showEdit={false}
        showDelete
        onDeleteClick={(row) => {
          setDeleteTarget(row);
          setDeleteDialogOpen(true);
        }}
        showExportButton
        allData={allDataForExport}
        fileName="Unregistered_Assets"
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


      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              Delete asset{" "}
              <span className="font-semibold">
                {deleteTarget?.systemSerialNumber}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnregisteredAssetsRoute;

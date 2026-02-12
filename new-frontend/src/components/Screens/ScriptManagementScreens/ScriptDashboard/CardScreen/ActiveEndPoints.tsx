
import  { useState, useMemo, useEffect } from "react";
import {   MapPinCheckInside, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useGetActiveAssets,
  useGetActiveAssetCount,
  useSearchActiveAssets,
  useSearchActiveAssetCount,
} from "./hooks";
import { Input } from "@/components/ui/input";

const ActiveEndPointsRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "dd-MM-yyyy"));

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);

  const { data: rowData, isLoading, refetch } = useGetActiveAssets(page, rowsPerPage, selectedDate);
  const { data: standardTotalCount } = useGetActiveAssetCount(selectedDate);


  const searchMutation = useSearchActiveAssets();
  const searchCountMutation = useSearchActiveAssetCount();

  const tableData = useMemo(
    () => (isSearchActive ? filteredData : rowData || []),
    [isSearchActive, filteredData, rowData]
  );

  const totalItems = isSearchActive ? searchDataCount : standardTotalCount || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const columnDefs = useMemo(() => [
    {
      headerName: "Sr No",
      valueGetter: (p: any) => (page - 1) * rowsPerPage + (p.node.rowIndex + 1),
      width: 80,
    },
    { field: "serialNo", headerName: "Serial Number", flex: 1 },
    { field: "computerName", headerName: "Computer Name", flex: 1 },
    { field: "systemIp", headerName: "IP Address", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: (p: any) => (
        <Badge className={p.value === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}>
          {p.value}
        </Badge>
      ),
    },
    {
      field: "lastActive",
      headerName: "Last Sync",
      flex: 1,
      cellRenderer: (p: any) => (p.value ? p.value.split("T")[0] : "-"),
    },
  ], [page, rowsPerPage]);

  const handleGroupSearch = (filters: Record<string, any>) => {
    const activeFilters = Object.entries(filters)
      .filter(([_, f]) => f.filter && f.filter.trim() !== "")
      .map(([key, value]) => ({ columnName: key, value: value.filter }));

    if (activeFilters.length === 0) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = {
      columns: activeFilters,
      pageNo: 1,
      perPage: rowsPerPage,
      date: selectedDate,
    };

    setFilterColumns(activeFilters);
    setIsSearchActive(true);
    setPage(1);

    searchMutation.mutate(payload, {
      onSuccess: (data) => setFilteredData(data || []),
    });

    searchCountMutation.mutate(payload, {
      onSuccess: (count) => setSearchDataCount(count || 0),
    });
  };

  useEffect(() => {
    if (!isSearchActive) return;
    const payload = {
      columns: filterColumns,
      pageNo: page,
      perPage: rowsPerPage,
      date: selectedDate,
    };
    searchMutation.mutate(payload, {
      onSuccess: (data) => setFilteredData(data || []),
    });
  }, [page, rowsPerPage, selectedDate]);


   const { data: getAllData } = useGetActiveAssets(1, totalItems, selectedDate);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      const payload = {
        columns: filterColumns,
        pageNo: 1,
        perPage: searchDataCount,
        date: selectedDate,
      };
      return new Promise((resolve, reject) => {
        searchMutation.mutate(payload, {
          onSuccess: (data) => resolve(data || []),
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



  






const dateFilter = (
  <div className="flex gap-2">
  <div >
  
    <Input 
    
      type="date" 
      className=" h-8 text-sm font-medium"
      onChange={(e) => {
        const val = e.target.value;
        if (val) {
          const [y, m, d] = val.split("-");
          setSelectedDate(`${d}-${m}-${y}`);
          setPage(1);
        }
      }}
    />
    
  </div>
       <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            </div>
);




  return (
     <div className="container mx-auto ">
        <Breadcrumb
          items={[
            { label: "Module Dashboard", path: "/app/dashboard" },
            { label: "Script Dashboard", path: "/app/scriptRunner/scriptDashboard" },
            { label: "Active Endpoints" },
          ]}
        />
 
     <div className="flex flex-col lg:flex-row lg:items-center mt-4 lg:justify-between gap-4 pb-4 border-b mb-4 border-border">

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <MapPinCheckInside className="h-6 w-6 text-primary" />
          </div>
          <div>
     <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Active</span> Endpoint
          </h1>
            <p className="text-sm text-muted-foreground">Monitor and manage all active endpoints across your network with real-time status updates...</p>
          </div>
        </div>

        {/* Inline Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <MapPinCheckInside className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">{totalItems}</p>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 rounded-lg border border-green-500/10">
            <ActivitySquareIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{totalItems}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 rounded-lg border border-red-500/10">
            <PanelTopInactive className="h-4 w-4 text-red-600 dark:text-red-400" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{totalItems}</p>
            </div>
          </div> */}

        
       
        </div>
      </div>
     
        <DataTable
          rowData={tableData}
          colDefs={columnDefs}
          isLoading={isLoading}
          
          showExportButton
          allData={allDataForExport}
          fileName={`InActive_Endpoints_Report_${selectedDate}`}
          showPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          onFilterChange={handleGroupSearch}
          addComponent={dateFilter}
        />
      </div>
  );
};

export default ActiveEndPointsRoute;







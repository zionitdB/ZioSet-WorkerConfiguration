import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
  Activity, 
  RefreshCw, 
  Terminal,
  Search,
  FilterX
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetExecutionReport } from "./hooks"; 

const ScriptExecutionReport = () => {
  const location = useLocation();
  const { scriptId, status: initialStatus } = location.state || {};

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  
  const { data: response, isLoading, refetch, isFetching } = useGetExecutionReport(
    page,
    rowsPerPage,
    {
      scriptId,
      status: initialStatus,
      serialNumberOrHostName: searchQuery,
      finishedAfter: startDate,
      finishedBefore: endDate,
    }
  );

  const rowData = response?.data?.content || [];
  const totalItems = response?.data?.totalElements || 0;
  const totalPages = response?.data?.totalPages || 0;

  const columnDefs = useMemo(() => [
    {
      headerName: "Sr No",
      valueGetter: (p: any) => (page - 1) * rowsPerPage + (p.node.rowIndex + 1),
      width: 80,
    },
    { field: "runUuid", headerName: "Execution UUID", flex: 1.5, fontStyle: 'monospace' },
    { field: "scriptName", headerName: "Script Name", flex: 1 },
    { field: "hostName", headerName: "Host", flex: 1 },
    { field: "systemSerialNumber", headerName: "Serial No", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      cellRenderer: (p: any) => (
        <Badge className={
          p.value === "SUCCESS" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : 
          p.value === "FAILED" ? "bg-rose-500/20 text-rose-500 border-rose-500/30" : 
          "bg-amber-500/20 text-amber-500 border-amber-500/30"
        }>
          {p.value}
        </Badge>
      ),
    },
    {
      headerName: "Duration",
      width: 100,
      valueGetter: (p: any) => {
        const start = new Date(p.data.startedAt).getTime();
        const end = new Date(p.data.finishedAt).getTime();
        return `${Math.round((end - start) / 1000)}s`;
      }
    },
    {
      field: "startedAt",
      headerName: "Execution Time",
      flex: 1.2,
      cellRenderer: (p: any) => p.value ? new Date(p.value).toLocaleString() : "-",
    },
  ], [page, rowsPerPage]);


  const { refetch: fetchAllData } = useGetExecutionReport(
    1, 
    totalItems || 10,
    {
      scriptId,
      status: initialStatus,
      serialNumberOrHostName: searchQuery,
      finishedAfter: startDate,
      finishedBefore: endDate,
    }
  );

  const allDataForExport = async () => {
    const res = await fetchAllData();
    return res.data?.data?.content || [];
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Filter UI Component
  const customFilters = (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-muted/20 rounded-xl border border-border/40">
      <div className="relative min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Host or Serial No..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          className="pl-9 h-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Finished After:</span>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
          className="h-9 w-40"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Finished Before:</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
          className="h-9 w-40"
        />
      </div>
      <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
        <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
        Refresh
      </Button>
      <Button variant="ghost" size="sm" onClick={resetFilters}>
        <FilterX className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto pb-8">
      <Breadcrumb
        items={[
          { label: "Module Dashboard", path: "/app/dashboard" },
          { label: "Script Command Center", path: "/app/scriptRunner/scriptWiseDashboard" },
          { label: "Execution Report" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center mt-6 lg:justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Terminal className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Execution <span className="text-primary">Report</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Showing {initialStatus || 'All'} executions for script ID: {scriptId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <Activity className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total Runs</p>
              <p className="text-lg font-bold text-foreground">{totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      {customFilters}

  
          <DataTable
            rowData={rowData}
            colDefs={columnDefs}
            isLoading={isLoading}
            showExportButton
            allData={allDataForExport}
            fileName={`Execution_Report_${initialStatus}`}
            showPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            showFilter={false} 
            showActions={false}
          />

    </div>
  );
};

export default ScriptExecutionReport;
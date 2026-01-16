

import { useState, useMemo } from "react";
import {  RefreshCw, ClipboardList, CheckCircle2, 
  ShieldAlert, Monitor, Search, Calendar, XCircle 
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  useGetExecutionResults,
  useGetExecutionByGroupSearch,
  useGetExecutionCountByGroupSearch,
} from "./hooks";
import Breadcrumb from "@/components/common/breadcrumb";

const ExecutionResultRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // New Filter States
  const [srNumber, setSrNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
const [activeFilters, setActiveFilters] = useState({
    srNumber: "",
    startDate: "",
    endDate: ""
  });
  // Fetch data with new filters
  const { data: apiResponse, isLoading } = useGetExecutionResults(
    page, 
    rowsPerPage, 
   activeFilters
  );

  const getExecBySearch = useGetExecutionByGroupSearch();
  const getExecCountBySearch = useGetExecutionCountByGroupSearch();

  const handleApplyFilters = () => {
    setActiveFilters({
      srNumber: srNumber,
      startDate: startDate,
      endDate: endDate
    });
    setPage(1); // Reset to first page on new search
  };

  // Reset logic
  const handleClearFilters = () => {
    setSrNumber("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const serviceData = useMemo(() => (filteredData.length ? filteredData : apiResponse?.content || []), [filteredData, apiResponse]);
  const totalItems = isSearchActive ? searchDataCount : apiResponse?.totalElements || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const stats = useMemo(() => {
    const dataForStats = filteredData.length ? filteredData : apiResponse?.content || [];
    const success = dataForStats.filter((r: any) => r.returnCode === 0).length;
    const failed = dataForStats.filter((r: any) => r.returnCode !== 0).length;
    return { success, failed };
  }, [filteredData, apiResponse]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Sr No",
      valueGetter: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
      width: 80,
      filter: false,
    },
    { field: "scriptName", headerName: "Script Name", flex: 1.5 },
    { field: "runUuid", headerName: "Script Run ID", flex: 1 },
    { field: "systemSerialNumber", headerName: "Serial Number", flex: 1 },
    { 
      field: "startedAt", 
      headerName: "Execution Start", 
      flex: 1,
      cellRenderer: (p: any) => p.value ? format(new Date(p.value), "dd-MM-yyyy HH:mm") : "-" 
    },
    { 
      field: "finishedAt", 
      headerName: "Finish Date & Time", 
      flex: 1,
      cellRenderer: (p: any) => p.value ? format(new Date(p.value), "dd-MM-yyyy HH:mm") : "-" 
    },
    {
      field: "returnCode",
      headerName: "Result Code",
      width: 130,
      cellRenderer: (params: any) => (
        <Badge variant={params.value === 0 ? "default" : "destructive"} className="rounded-full px-3">
          {params.value === 0 ? "Success (0)" : `Error (${params.value})`}
        </Badge>
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
    // setFilterColumns(payload.columns);
    setIsSearchActive(true);
    getExecBySearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    getExecCountBySearch.mutate(payload, { onSuccess: (count) => setSearchDataCount(count || 0) });
  };

  return (
    <div className="container mx-auto space-y-6">
   <div className="mb-6">
          <Breadcrumb
            items={[
              {
                label: "Module Dashboard",
                path: "/dashboard",
              },
              {
                label: "Execution Result",
              },
            ]}
          />
        </div>
        
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="text-primary">Execution</span> Results
            </h1>
            <p className="text-sm text-muted-foreground">Monitor and export script execution logs</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatBox icon={<Monitor className="text-blue-600" />} label="Total Runs" value={totalItems} bg="bg-blue-500/5" border="border-blue-500/10" />
          <StatBox icon={<CheckCircle2 className="text-green-600" />} label="Success" value={stats.success} bg="bg-green-500/5" border="border-green-500/10" />
          <StatBox icon={<ShieldAlert className="text-red-600" />} label="Failed" value={stats.failed} bg="bg-red-500/5" border="border-red-500/10" />
        </div>
      </div>

      {/* NEW: Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-5 rounded-xl border border-border shadow-sm items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="h-3.5 w-3.5" /> Serial Number
          </label>
          <Input 
            placeholder="Enter Serial Number..." 
            value={srNumber}
            onChange={(e) => { setSrNumber(e.target.value); setPage(1); }}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> Finished After
          </label>
          <Input 
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> Finished Before
          </label>
          <Input 
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="bg-background"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={handleClearFilters}
          >
            <XCircle className="h-4 w-4" /> Clear
          </Button>
          <Button 
            variant="default" 
            className="flex-1 gap-2" 
          onClick={handleApplyFilters}
          >
            { <RefreshCw className="h-4 w-4" />} 
            Apply
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={isLoading}
        showEdit={false}
        showDelete={false}
        showPagination
        showExportButton={true}
        showActions={false} 
        showFilter={false} 
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        fileName="execution_logs"
      />
    </div>
  );
};

const StatBox = ({ icon, label, value, bg, border }: any) => (
  <div className={`flex items-center gap-2 px-4 py-2 ${bg} rounded-lg border ${border}`}>
    {icon}
    <div className="text-left">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default ExecutionResultRoute;
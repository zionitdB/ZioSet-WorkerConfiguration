

import { useState, useMemo } from "react";
import {  RefreshCw, ClipboardList, CheckCircle2, 
  ShieldAlert, Monitor, Search, Calendar, XCircle, 
  SubscriptIcon
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
  useGetScripts,
} from "./hooks";
import ScriptExecutionDialog from "./ViewScript";
import { ComboboxDropdown } from "@/components/common/ComboBox";

const ExecutionResultRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
const [selectedScript, setSelectedScript] = useState<any>(null);


  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    serialNumber: "",
    scriptId: "",
    hostName: "",
    finishedAfter: "",
    finishedBefore: "",
  });

  const [activeFilters, setActiveFilters] = useState(filters);

  const { data: apiResponse, isLoading } = useGetExecutionResults(
    page, 
    rowsPerPage, 
   activeFilters
  );
const { data: scripts=[] } = useGetScripts();

  const getExecBySearch = useGetExecutionByGroupSearch();
  const getExecCountBySearch = useGetExecutionCountByGroupSearch();


const handleApplyFilters = () => {
  console.log("njfsbdn");
  
  setActiveFilters(filters);
  setPage(1);
};

const handleClearFilters = () => {
  const empty = {
    serialNumber: "",
    scriptId: "",
    hostName: "",
    finishedAfter: "",
    finishedBefore: "",
  };
  setFilters(empty);
  setActiveFilters(empty);
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
      { field: "hostName", headerName: "Host Name", flex: 1.5 },
    { field: "runUuid", headerName: "Script Run ID", flex: 1 },
    { field: "systemSerialNumber", headerName: "Serial Number", flex: 1 },
        { field: "stdout", headerName: "Standard Output ", flex: 1 },
            { field: "stderr", headerName: "Standard Error ", flex: 1 },
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
  headerName: "scriptId",
  flex: 2,
  cellRenderer: (params: any) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          setSelectedScript({
            id: params.data.scriptId,
            name: params.data.scriptName,
          })
        }
        className="mt-2"
      >
        View Script
      </Button>
    </div>
  ),
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



    // const getAllData = useGetExecutionResults(1, totalItems||10000,activeFilters);
  

    
  return (
    <div className="container mx-auto space-y-6">
   {/* <div className="mb-6">
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
        </div> */}
        
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-5 rounded-xl border border-border shadow-sm items-end">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="h-3.5 w-3.5" /> Serial Number
          </label>
          <Input 
            placeholder="Enter Serial Number/Host Name here..." 
            value={filters.serialNumber}
  onChange={(e) =>
    setFilters((p) => ({ ...p, serialNumber: e.target.value }))
  }
            className="bg-background"
          />
        </div>
            <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <SubscriptIcon className="h-3.5 w-3.5" /> Scripts
          </label>
        {/* <Select value={filters.scriptId} onValueChange={(v) => setFilters(p => ({ ...p, scriptId: v }))}>
          <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select Script" /></SelectTrigger>
          <SelectContent>
            {scripts?.map((s: any) => (
              <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        
                      <ComboboxDropdown
          value={filters.scriptId}
          onChange={(v) => setFilters(p => ({ ...p, scriptId: v }))}
          placeholder="⚡ Select or type script"
          options={scripts.map((s: any) => ({
            value: s.id,
            label: s.name,
            description: s.description || "No description available",
          }))}
        />
     </div>
     {/* <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Laptop className="h-3.5 w-3.5" /> Host Name
          </label>
        <Input
          placeholder="Host Name"
          value={filters.hostName}
          onChange={(e) => setFilters(p => ({ ...p, hostName: e.target.value }))}
            className="bg-background"
        />
    </div> */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> Finished After
          </label>
          <Input 
            type="date"
            value={filters.finishedAfter}
  onChange={(e) =>
    setFilters((p) => ({ ...p, finishedAfter: e.target.value }))
  }
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> Finished Before
          </label>
          <Input 
            type="date"
       value={filters.finishedBefore}
  onChange={(e) =>
    setFilters((p) => ({ ...p, finishedBefore: e.target.value }))
  }
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

      {selectedScript && (
  <ScriptExecutionDialog
    open={!!selectedScript}
    scriptId={selectedScript.id}
    scriptName={selectedScript.name}
    onClose={() => setSelectedScript(null)}
  />
)}

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
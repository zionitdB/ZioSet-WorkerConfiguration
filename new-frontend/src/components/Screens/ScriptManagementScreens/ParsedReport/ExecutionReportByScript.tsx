import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
  RefreshCw, 
  Search,
  FileJson,
  FilterX
} from "lucide-react";
import { format } from "date-fns";
import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetExecutionReport } from "../ScriptDashboard/CardScreen/hooks";

const ParsedExecutionDetails = () => {
  const location = useLocation();
  const { scriptId, scriptName, status: initialStatus } = location.state || {};

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
      width: 70,
    },
    { field: "hostName", headerName: "Host / Endpoint", flex: 1, cellClass: "font-medium" },
    { field: "systemSerialNumber", headerName: "Serial No", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      cellRenderer: (p: any) => (
        <Badge variant="outline" className={
          p.value === "SUCCESS" ? "border-emerald-500 text-emerald-600 bg-emerald-50" : 
          "border-rose-500 text-rose-600 bg-rose-50"
        }>
          {p.value}
        </Badge>
      ),
    },
    {
      field: "parsedData",
      headerName: "Parsed Result Preview",
      flex: 1.5,
      cellRenderer: (p: any) => {
        const data = p.data.parsedData;
        if (!data) return <span className="text-muted-foreground italic text-xs">No parsed data</span>;
        // Show first 2 keys as a preview
        const preview = Object.entries(data).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(", ");
        return <span className="text-xs font-mono truncate block">{preview}...</span>;
      }
    },
    {
      field: "finishedAt",
      headerName: "Processed At",
      flex: 1,
      cellRenderer: (p: any) => p.value ? format(new Date(p.value), "dd MMM yyyy HH:mm") : "-",
    }
  ], [page, rowsPerPage]);

  const { refetch: fetchAllData } = useGetExecutionReport(1, totalItems || 10, {
    scriptId,
    status: initialStatus,
    serialNumberOrHostName: searchQuery,
    finishedAfter: startDate,
    finishedBefore: endDate,
  });

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
  return (
    <div className="container mx-auto pb-8">
      <Breadcrumb
        items={[
            { label: "Module Dashboard", path: "/dashboard" },
            { label: "Parsed Report", path: "/scriptRunner/parsedReport" },
          { label: `Details: ${scriptName || 'Script'}` },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center mt-6 lg:justify-between gap-4 pb-6 mb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">
            <FileJson className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{scriptName} <span className="text-primary text-xl font-medium">Output</span></h1>
            <p className="text-sm text-muted-foreground">ID: {scriptId} • Analyzing parsed key-value pairs per host.</p>
          </div>
        </div>

        <div className="bg-muted/50 p-1 rounded-xl border flex gap-1">
            <div className="px-4 py-2 text-center border-r">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Assets</p>
                <p className="text-lg font-bold">{totalItems}</p>
            </div>
            <div className="px-4 py-2 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                <Badge className="bg-emerald-500">{initialStatus || "ALL"}</Badge>
            </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-muted/20 rounded-xl border border-border/40">
        <div className="relative flex-1 min-w-62.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Host or Serial Number..." 
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40 rounded-xl h-10" />
            <span className="text-muted-foreground">to</span>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40 rounded-xl h-10" />
        </div>
        <Button variant="outline" className="rounded-xl h-10" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
        <FilterX className="h-4 w-4 mr-2" />
        Reset
      </Button>
      </div>


          <DataTable
            rowData={rowData}
            colDefs={columnDefs}
            isLoading={isLoading}
            showExportButton
            allData={allDataForExport}
            fileName={`Parsed_Report_${scriptName}`}
            showPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            showFilter={false} 
            showActions={false}
          />
     
{/* 

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Terminal className="h-5 w-5 text-primary" /></div>
                <div>
                    <SheetTitle>Execution Details</SheetTitle>
                    <SheetDescription>Host: {selectedResult?.hostName}</SheetDescription>
                </div>
            </div>
          </SheetHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/50 border">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Serial Number</p>
                    <p className="text-sm font-mono">{selectedResult?.systemSerialNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                    <Badge className="mt-1">{selectedResult?.status}</Badge>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <FileJson className="h-4 w-4 text-primary" /> Parsed Data Output
                </h4>
                <div className="bg-slate-950 text-slate-50 p-4 rounded-2xl overflow-auto max-h-100 font-mono text-xs leading-relaxed shadow-inner">
                    {selectedResult?.parsedData ? (
                        <pre>{JSON.stringify(selectedResult.parsedData, null, 2)}</pre>
                    ) : (
                        <p className="text-slate-500 italic">No structured data found for this execution.</p>
                    )}
                </div>
            </div>

            <Button className="w-full rounded-xl gap-2" variant="secondary" onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedResult?.parsedData));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", `result_${selectedResult?.hostName}.json`);
                downloadAnchorNode.click();
            }}>
                <Download className="h-4 w-4" /> Download Result JSON
            </Button>
          </div>
        </SheetContent>
      </Sheet> */}
    </div>
  );
};

export default ParsedExecutionDetails;
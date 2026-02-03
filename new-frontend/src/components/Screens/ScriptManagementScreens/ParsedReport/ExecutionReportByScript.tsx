import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
  RefreshCw, 
  Search,
  FileJson,
  FilterX
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetParsedExecutionReport } from "./hooks";


const extractFieldKeys = (rows: any[]) => {
  const keys = new Set<string>();

  rows.forEach((row) => {
    const fields = row?.parsedData?.fields;
    if (!fields) return;

    if (Array.isArray(fields)) {
      fields.forEach((obj) =>
        Object.keys(obj || {}).forEach((k) => keys.add(k))
      );
    } else if (typeof fields === "object") {
      Object.keys(fields).forEach((k) => keys.add(k));
    }
  });

  return Array.from(keys);
};


const ParsedExecutionDetails = () => {
  const location = useLocation();
  const { scriptId, scriptName, status: initialStatus } = location.state || {};

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  

  const { data: response, isLoading, refetch, isFetching } = useGetParsedExecutionReport(
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

  const rowData = response?.content || [];
  const totalItems = response?.totalElements || 0;
  const totalPages = response?.totalPages || 0;

const toCamelCase = (str: string) =>
  str
    .replace(/[-_ ]+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());


    const flattenedRowData = rowData.map((row: any) => {
  const fields = row?.parsedData?.fields;
  let flatFields = {};

  if (Array.isArray(fields)) flatFields = fields[0] || {};
  else if (fields && typeof fields === "object") flatFields = fields;

  return {
    ...row,
    ...flatFields,
  };
});

const dynamicFieldColumns = useMemo(() => {
  const fieldKeys = extractFieldKeys(flattenedRowData);
console.log("fieldKeys",fieldKeys);

  return fieldKeys.map((key) => ({
    
   headerName: toCamelCase(key),
    field: key, 
    flex: 1,
    valueGetter: (p: any) => {
      const fields = p.data?.parsedData?.fields;
      if (!fields) return "-";

      if (Array.isArray(fields)) {
        return fields[0]?.[key] ?? "-";
      }

      return fields[key] ?? "-";
    },
    cellClass: "font-mono text-xs",
  }));
}, [flattenedRowData]);


const columnDefs = useMemo(() => [
  {
    headerName: "Sr No",
    valueGetter: (p: any) =>
      (page - 1) * rowsPerPage + (p.node.rowIndex + 1),
    width: 70,
  },
  {
    field: "status",
    headerName: "Status",
    width: 110,
    cellRenderer: (p: any) => (
      <Badge
        variant="outline"
        className={
          p.value === "SUCCESS"
            ? "border-emerald-500 text-emerald-600 bg-emerald-50"
            : "border-rose-500 text-rose-600 bg-rose-50"
        }
      >
        {p.value}
      </Badge>
    ),
  },

  ...dynamicFieldColumns,

], [page, rowsPerPage, dynamicFieldColumns]);





  const { refetch: fetchAllData } = useGetParsedExecutionReport(1, totalItems || 10, {
    scriptId,
    status: initialStatus,
    serialNumberOrHostName: searchQuery,
    finishedAfter: startDate,
    finishedBefore: endDate,
  });



const allDataForExport = async () => {
  const res = await fetchAllData();
  const rows = res?.data?.content || [];
  return rows;
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
     

    </div>
  );
};

export default ParsedExecutionDetails;
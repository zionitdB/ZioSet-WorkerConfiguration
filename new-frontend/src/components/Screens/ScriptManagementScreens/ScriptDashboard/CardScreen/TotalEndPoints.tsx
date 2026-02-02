import { useState, useMemo, useEffect } from "react";
import { RefreshCw, Monitor, Apple, HelpCircle, Calendar, ListEndIcon } from "lucide-react";
import { format } from "date-fns";
import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  useGetOSDetails,
  useGetTotalAssets,
  useGetTotalAssetCount,
  useSearchTotalAssets,
  useSearchTotalAssetCount,
} from "./hooks";
import { Input } from "@/components/ui/input";

const TotalEndPointsRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "dd-MM-yyyy"));

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);

  const { data: osDetails } = useGetOSDetails();
  const { data: rowData, isLoading, refetch, isFetching } = useGetTotalAssets(page, rowsPerPage, selectedDate);
  const { data: standardTotalCount } = useGetTotalAssetCount(selectedDate);

  const searchMutation = useSearchTotalAssets();
  const searchCountMutation = useSearchTotalAssetCount();

  const tableData = useMemo(
    () => (isSearchActive ? filteredData : rowData || []),
    [isSearchActive, filteredData, rowData]
  );

  const totalItems = isSearchActive ? searchDataCount : standardTotalCount || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const columnDefs = useMemo(
    () => [
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
    ],
    [page, rowsPerPage]
  );

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

  const { data: getAllData } = useGetTotalAssets(1, totalItems, selectedDate);

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

  const getOSIcon = (osName: string) => {
    switch (osName) {
      case "Windows":
        return <Monitor className="w-6 h-6" />;
      case "MAC":
        return <Apple className="w-6 h-6" />;
      default:
        return <HelpCircle className="w-6 h-6" />;
    }
  };

  const getOSGradient = (osName: string) => {
    switch (osName) {
      case "Windows":
        return "from-blue-500 to-blue-600";
      case "MAC":
        return "from-slate-600 to-slate-700";
      default:
        return "from-purple-500 to-purple-600";
    }
  };

  const dateFilter = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <Input
          type="date"
          className="h-9 pl-10 pr-4 text-sm font-medium border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
        disabled={isFetching}
      >
        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto ">
      <Breadcrumb
        items={[
          { label: "Module Dashboard", path: "/dashboard" },
          { label: "Script Dashboard", path: "/scriptRunner/scriptDashboard" },
          { label: "Total Endpoints" },
        ]}
      />



 <div className="flex flex-col lg:flex-row lg:items-center mt-4 lg:justify-between gap-4 pb-4 mb-4 border-b border-border">

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ListEndIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
     <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Total</span> Endpoint
          </h1>
            <p className="text-sm text-muted-foreground">  Monitor and manage all endpoints across your network with real-time status updates and OS distribution analytics...</p>
          </div>
        </div>

        {/* Inline Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <ListEndIcon className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">{totalItems}</p>
            </div>
          </div>

        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {osDetails?.map((os: any) => (
          <Card
            key={os.id}
            className="border-none shadow-md hover:shadow-xl transition-all duration-300  overflow-hidden group"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {os.name}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                    {os.count.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">Total Endpoints</p>
                </div>
                <div
                  className={`p-4 bg-linear-to-br ${getOSGradient(
                    os.name
                  )} rounded-2xl text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {getOSIcon(os.name)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">Distribution</span>
                  <span className="text-sm font-bold text-slate-900">{os.percentage}%</span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-linear-to-r ${getOSGradient(
                      os.name
                    )} rounded-full transition-all duration-500 ease-out shadow-sm`}
                    style={{ width: `${os.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

          <DataTable
            rowData={tableData}
            colDefs={columnDefs}
            isLoading={isLoading}
            showExportButton
            allData={allDataForExport}
            fileName={`Endpoints_Report_${selectedDate}`}
            showPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            onFilterChange={handleGroupSearch}
            addComponent={dateFilter}
            showFilter={false}
            showActions={false}
          />

    </div>
  );
};

export default TotalEndPointsRoute;
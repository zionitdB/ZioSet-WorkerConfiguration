import { useState, useMemo } from "react";
import {
  useGetScriptTypeCount,
  useGetTargetSystemsCount,
  useGetLocationList,
  useGetLocationWiseExecutions,
  useGetLocationWiseTargetSystems,
  useGetExecutionsBySerialNumber,
} from "./hooks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  Repeat,
  Terminal,
  Server,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  FileCode,
  BarChart3,
  Loader2,
  AlertCircle,
  Zap,
  Target,
  Layers,
  Code,
  GitBranch,
  Box,
  Hash,
  Timer,
  RefreshCw,
  MapPin,
  ChevronRight,
  ArrowRight,
  Database,
  Eye,
  ArrowLeft,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ColDef } from "ag-grid-community";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/common/DataTable";
import { useGetDashboardCountsData } from "../ScriptDashboard/hooks";
import { cn } from "@/lib/utils";

type ScriptType = "ONE_TIME" | "RECURRING" | "ALL";
type StatusType = "SUCCESS" | "FAILED" | "PENDING";

interface Script {
  scriptId: number;
  scriptName: string;
  targetCount: number;
}

interface Execution {
  id: number;
  runUuid: string;
  scriptId: number;
  scriptName: string;
  systemSerialNumber: string;
  startedAt: string;
  finishedAt?: string;
  returnCode: number;
  status: string;
  stdout: string;
  stderr: string;
  hostName: string;
  parsedData: any;
}

interface LocationData {
  count: number;
  location: string;
}

interface TargetSystem {
  systemSerialNumber: string;
  hostName?: string;
  count?: number;
}

const ScriptExecutionDrillReport = () => {
  const { data: typeCount } = useGetScriptTypeCount();
  const { data: targetData, isLoading: loadingTargets } =
    useGetTargetSystemsCount();

  // Navigation state
  const [selectedType, setSelectedType] = useState<ScriptType>("ONE_TIME");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<any>('');

  // Search and filter state
  const [searchScript, setSearchScript] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchExecution, setSearchExecution] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [serialNumberFilter, setSerialNumberFilter] = useState<string>("all");
  console.log("serialNumberFilter", serialNumberFilter);

  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(
    null,
  );
  const [isLogDialogOpen, setIsLogDialogOpen] = useState<boolean>(false);

  const { data: dashboardCount } = useGetDashboardCountsData(
    selectedScript?.scriptId,
  );

  const { data: locationListData, isLoading: loadingLocations } =
    useGetLocationList(selectedScript?.scriptId, selectedStatus || undefined);

  const { data: oneTimeExecutionsData, isLoading: loadingOneTimeExecutions } =
    useGetLocationWiseExecutions(
      selectedType === "ONE_TIME" ? selectedScript?.scriptId : undefined,
      selectedLocation || undefined,
      selectedStatus || undefined,
    );

  const { data: targetSystemsData, isLoading: loadingTargetSystems } =
    useGetLocationWiseTargetSystems(
      selectedType === "RECURRING" ? selectedScript?.scriptId : undefined,
      selectedLocation || undefined,
      selectedStatus || undefined,
    );

  const {
    data: recurringExecutionsData,
    isLoading: loadingRecurringExecutions,
  } = useGetExecutionsBySerialNumber(
    selectedType === "RECURRING"
      ? selectedSerialNumber || undefined
      : undefined,
  );

  // Combine all scripts
  const allScripts = useMemo(() => {
    const oneTime = targetData?.data?.OneTimeList || [];
    const recurring = targetData?.data?.Recurring || [];

    if (selectedType === "ONE_TIME") return oneTime;
    if (selectedType === "RECURRING") return recurring;
    return [...oneTime, ...recurring];
  }, [targetData, selectedType]);

  const filteredScripts = allScripts.filter((s: Script) =>
    s.scriptName.toLowerCase().includes(searchScript.toLowerCase()),
  );

  // Process locations
  const locations: LocationData[] = useMemo(() => {
    if (!locationListData || !Array.isArray(locationListData)) return [];
    return locationListData;
  }, [locationListData]);

  const filteredLocations = locations.filter((loc) =>
    loc.location.toLowerCase().includes(searchLocation.toLowerCase()),
  );

  // Get unique locations for filter dropdown (ONE_TIME)
  const uniqueLocations = useMemo(() => {
    if (selectedType !== "ONE_TIME" || !oneTimeExecutionsData?.data) return [];
    const locationSet = new Set(
      oneTimeExecutionsData.data.map(
        (exec: Execution) => exec.hostName || "Unknown",
      ),
    );
    return Array.from(locationSet);
  }, [oneTimeExecutionsData, selectedType]);

  const executions: Execution[] = useMemo(() => {
    if (selectedType === "ONE_TIME") {
      return oneTimeExecutionsData?.data || [];
    } else if (selectedType === "RECURRING" && selectedSerialNumber) {
      return recurringExecutionsData || [];
    }
    return [];
  }, [
    selectedType,
    oneTimeExecutionsData,
    recurringExecutionsData,
    selectedSerialNumber,
  ]);

  // Apply filters
  const filteredExecutions = useMemo(() => {
    let filtered = executions;

    if (searchExecution) {
      filtered = filtered.filter((e: Execution) =>
        e.hostName.toLowerCase().includes(searchExecution.toLowerCase()),
      );
    }
    if (selectedType === "ONE_TIME" && locationFilter !== "all") {
      filtered = filtered.filter(
        (e: Execution) => e.hostName === locationFilter,
      );
    }

    return filtered;
  }, [executions, searchExecution, locationFilter, selectedType]);

  // Status counts
  const statusCounts = useMemo(() => {
    if (!selectedScript || !dashboardCount)
      return { SUCCESS: 0, FAILED: 0, PENDING: 0 };
    return {
      SUCCESS: dashboardCount?.success || 0,
      FAILED: dashboardCount?.failed || 0,
      PENDING: dashboardCount?.pending || 0,
    };
  }, [selectedScript, dashboardCount]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "FAILED":
      case "ERROR":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "RUNNING":
      case "PENDING":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return <CheckCircle2 className="h-4 w-4" />;
      case "FAILED":
      case "ERROR":
        return <XCircle className="h-4 w-4" />;
      case "RUNNING":
      case "PENDING":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalOneTime = typeCount?.oneTimeCount || 0;
  const totalRecurring = typeCount?.recurringCount || 0;
  const totalScripts = totalOneTime + totalRecurring;

  const handleTypeChange = (type: ScriptType) => {
    if (type === selectedType) return;

    setSelectedType(type);

    setSelectedScript(null);
    setSelectedStatus(null);
    setSelectedLocation(null);
    setSelectedSerialNumber(null);

    setSearchScript("");
    setSearchLocation("");
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");

    setPage(1);
  };

  const handleScriptSelect = (script: Script) => {
    setSelectedScript(script);
    setSelectedStatus(null);
    setSelectedLocation(null);
    setSelectedSerialNumber(null);
    setSearchLocation("");
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");
    setPage(1);
  };

  const handleStatusSelect = (status: StatusType) => {
    setSelectedStatus(status);
    setSelectedLocation(null);
    setSelectedSerialNumber(null);
    setSearchLocation("");
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");
    setPage(1);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setSelectedSerialNumber(null);
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");
    setPage(1);
  };

  const handleSerialNumberSelect = (serialNo: string) => {
    setSelectedSerialNumber(serialNo);
    setSearchExecution("");
    setPage(1);
  };

  const handleViewLog = (execution: Execution) => {
    setSelectedExecution(execution);
    setIsLogDialogOpen(true);
  };

  const handleBackToScripts = () => {
    setSelectedScript(null);
    setSelectedStatus(null);
    setSelectedLocation(null);
    setSelectedSerialNumber(null);
    setSearchLocation("");
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");
  };

  const handleBackToStatus = () => {
    setSelectedStatus(null);
    setSelectedLocation(null);
    setSelectedSerialNumber(null);
    setSearchLocation("");
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");
  };

  const handleBackToLocations = () => {
    setSelectedLocation(null);
    setSelectedSerialNumber(null);
    setSearchExecution("");
    setLocationFilter("all");
    setSerialNumberFilter("all");
  };

  const handleBackToTargetSystems = () => {
    setSelectedSerialNumber(null);
    setSearchExecution("");
  };


  const columnDefs: ColDef<Execution>[] = [
    {
      field: "id",
      headerName: "#",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center h-full">
            <span className="font-bold text-muted-foreground">
              #{params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "hostName",
      headerName: "Host Name",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-3 h-full">
            <div className="h-8 w-8 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Server className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">{params.value}</span>
          </div>
        );
      },
    },
    {
      field: "systemSerialNumber",
      headerName: "Serial Number",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <div>
            <Badge variant="outline">{params.value}</Badge>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      cellRenderer: (params: any) => {
        const status = params.value;
        return (
          <div className="flex items-center justify-center h-full">
            <Badge className={`${getStatusColor(status)} mt-2`}>
              {getStatusIcon(status)}
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      field: "startedAt",
      headerName: "Started At",
      width: 200,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-2 h-full text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            <span className="font-medium">
              {new Date(params.value).toLocaleString()}
            </span>
          </div>
        );
      },
    },
    {
      field: "returnCode",
      headerName: "Return Code",
      width: 130,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full mt-2">
            <Badge
              variant={params.value === 0 ? "default" : "destructive"}
              className="font-mono"
            >
              {params.value}
            </Badge>
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center gap-2 mt-1 h-full">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3"
              onClick={() => handleViewLog(params.data)}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
               Log
            </Button>
          </div>
        );
      },
    },
  ];

  const totalPages = Math.ceil(filteredExecutions.length / rowsPerPage);
  const paginatedExecutions = filteredExecutions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950">
   
      <aside className="w-95 sticky top-0 h-screen border-r border-border/50 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl flex flex-col shrink-0">
    
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/20">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Script Navigator
              </h2>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Library Management
              </p>
            </div>
          </div>

          <div className="bg-muted/40 p-1 rounded-xl border border-border/50 grid grid-cols-2 relative group/tabs">
            <button
              onClick={() => handleTypeChange("ONE_TIME")}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-all duration-300 outline-none",
                selectedType === "ONE_TIME"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative">One-Time</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
                  selectedType === "ONE_TIME"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted-foreground/10 text-muted-foreground",
                )}
              >
                {totalOneTime}
              </span>

              {selectedType === "ONE_TIME" && (
                <div className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/40 -z-10" />
              )}
            </button>

            <button
              onClick={() => handleTypeChange("RECURRING")}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-all duration-300 outline-none",
                selectedType === "RECURRING"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative">Recurring</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
                  selectedType === "RECURRING"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted-foreground/10 text-muted-foreground",
                )}
              >
                {totalRecurring}
              </span>

              {selectedType === "RECURRING" && (
                <div className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/40 -z-10" />
              )}
            </button>
          </div>

          {/* Search with focused ring effect */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search scripts..."
              value={searchScript}
              onChange={(e) => setSearchScript(e.target.value)}
              className="pl-9 bg-background/50 border-border/60 focus-visible:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* List Section */}
        <ScrollArea className="flex-1 h-40">
          <div className="space-y-1.5  px-3 pb-6">
            {loadingTargets ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
                <span className="text-xs text-muted-foreground animate-pulse">
                  Loading library...
                </span>
              </div>
            ) : filteredScripts.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Terminal className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No results found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredScripts.map((script: any) => {
                const isActive = selectedScript?.scriptId === script.scriptId;
                return (
                  <button
                    key={script.scriptId}
                    onClick={() => handleScriptSelect(script)}
                    className={cn(
                      "group w-full relative flex items-center gap-4 p-3 rounded-xl transition-all duration-200 outline-none",
                      isActive
                        ? "bg-primary/4 border-primary/20 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]"
                        : "hover:bg-muted/50 border-transparent hover:border-border/50",
                    )}
                  >
                    {/* Selection Indicator */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                    )}

                    <div
                      className={cn(
                        "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-background",
                      )}
                    >
                      <FileCode className="h-5 w-5" />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3
                          className={cn(
                            "font-semibold text-[13px] truncate",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {script.scriptName}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] bg-background/50 border-border/40 font-medium"
                        >
                          {script.targetCount}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate opacity-80">
                        Last modified 2 days ago
                      </p>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isActive
                          ? "text-primary translate-x-0"
                          : "text-muted-foreground/30 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0",
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl" />
                <div className="relative h-14 w-14 bg-linear-to-br from-primary via-primary to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-primary/30">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black">Execution Intelligence</h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Deep-dive script execution analysis
                  {selectedScript && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold">
                        {selectedScript.scriptName}
                      </span>
                    </>
                  )}
                  {selectedStatus && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold capitalize">
                        {selectedStatus}
                      </span>
                    </>
                  )}
                  {selectedLocation && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold">{selectedLocation}</span>
                    </>
                  )}
                  {selectedSerialNumber && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold font-mono text-xs">
                        {selectedSerialNumber}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-lg font-semibold"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        {/* Content Views */}
        {!selectedScript ? (
          // Dashboard Overview
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-black mb-2">
                    Dashboard Overview
                  </h2>
                  <p className="text-muted-foreground font-medium">
                    System-wide execution metrics and insights
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-border/40 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">
                        Total Scripts
                      </p>
                      <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                        {totalScripts}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">
                        One-Time
                      </p>
                      <p className="text-4xl font-black text-purple-600 dark:text-purple-400">
                        {totalOneTime}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <Repeat className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <GitBranch className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">
                        Recurring
                      </p>
                      <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                        {totalRecurring}
                      </p>
                    </CardContent>
                  </Card>

                  {/* <Card className="border-border/40 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">
                        Total Executions
                      </p>
                      <p className="text-4xl font-black text-orange-600 dark:text-orange-400">
                        {(statusCounts.SUCCESS + statusCounts.FAILED + statusCounts.PENDING) || "N/A"}
                      </p>
                    </CardContent>
                  </Card> */}
                </div>

                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <Box className="h-16 w-16 mx-auto text-primary/40 mb-4" />
                    <h3 className="text-xl font-black mb-2">
                      Select a Script to Begin
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choose a script from the left sidebar to drill down into
                      execution status, locations, and detailed logs.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        ) : !selectedStatus ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-8 space-y-6">
              
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToScripts}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Scripts
                </Button>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Terminal className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black mb-1">
                      {selectedScript.scriptName}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-4 w-4" />
                        <span className="font-semibold">
                          {selectedScript.targetCount} targets
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span className="font-semibold">
                          {statusCounts.SUCCESS +
                            statusCounts.FAILED +
                            statusCounts.PENDING}{" "}
                          executions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black mb-2">
                    Select Execution Status
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    Choose a status to view locations and detailed execution
                    logs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      type: "SUCCESS",
                      icon: CheckCircle2,
                      gradient: "from-emerald-500 to-green-500",
                      count: statusCounts.SUCCESS,
                      label: "Success",
                      desc: "Completed successfully across all locations",
                    },
                    {
                      type: "FAILED",
                      icon: XCircle,
                      gradient: "from-rose-500 to-red-500",
                      count: statusCounts.FAILED,
                      label: "Failed",
                      desc: "Execution errors requiring attention",
                    },
                    {
                      type: "PENDING",
                      icon: Clock,
                      gradient: "from-blue-500 to-cyan-500",
                      count: statusCounts.PENDING,
                      label: "Pending",
                      desc: "Queued and waiting for execution",
                    },
                  ].map((status) => {
                    const Icon = status.icon;
                    return (
                      <Card
                        key={status.type}
                        onClick={() =>
                          handleStatusSelect(status.type as StatusType)
                        }
                        className="group cursor-pointer border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900 hover:-translate-y-1"
                      >
                        <div
                          className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${status.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                        />

                        <CardHeader className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="relative">
                              <div
                                className={`absolute inset-0 bg-linear-to-r ${status.gradient} blur-2xl opacity-0 group-hover:opacity-50 transition-all rounded-2xl`}
                              />
                              <div
                                className={`relative h-14 w-14 bg-linear-to-br ${status.gradient
                                  .replace("from-", "from-")
                                  .replace("to-", "to-")
                                  .replace("500", "100")} dark:${status.gradient
                                  .replace("from-", "from-")
                                  .replace("to-", "to-")
                                  .replace(
                                    "500",
                                    "950/50",
                                  )} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg`}
                              >
                                <Icon
                                  className={`h-7 w-7 ${status.gradient
                                    .replace("from-", "text-")
                                    .replace(" to-", "")
                                    .replace(
                                      "500",
                                      "600",
                                    )} dark:${status.gradient
                                    .replace("from-", "text-")
                                    .replace(" to-", "")
                                    .replace("500", "400")}`}
                                />
                              </div>
                            </div>
                            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                          <CardTitle className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors mb-2">
                            {status.label}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 pt-0">
                          <div className="flex items-baseline gap-2 mb-4">
                            <p
                              className={`text-5xl font-black bg-linear-to-r ${status.gradient.replace(
                                "500",
                                "600",
                              )} dark:${status.gradient.replace(
                                "500",
                                "400",
                              )} bg-clip-text text-transparent`}
                            >
                              {status.count}
                            </p>
                            <p className="text-sm text-muted-foreground font-semibold">
                              executions
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {status.desc}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : !selectedLocation ? (
          // Location List
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Back Button */}
            <div className="px-8 py-4 border-b border-border/40">
              <Button variant="outline" size="sm" onClick={handleBackToStatus}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Status Selection
              </Button>
            </div>

            <div className="px-8 py-5 border-b border-border/40 bg-linear-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black mb-1 capitalize">
                    {selectedStatus} Executions by Location
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Select a location to view detailed execution logs
                  </p>
                </div>
                <div className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-border/40 shadow-sm">
                  <p className="text-xs text-muted-foreground font-bold mb-1">
                    Total Locations
                  </p>
                  <p className="text-2xl font-black">
                    {filteredLocations.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="Search locations..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 h-10 bg-white dark:bg-slate-800 rounded-lg border-border/50"
                  />
                </div>
                <Badge variant="outline" className="h-10 px-4 font-bold">
                  {filteredLocations.length} location
                  {filteredLocations.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-8">
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Card className="border-border/40">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-black">Location</TableHead>
                          <TableHead className="font-black text-center">
                            Execution Count
                          </TableHead>
                          <TableHead className="font-black text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLocations.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center py-20"
                            >
                              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                              <p className="text-sm font-semibold text-muted-foreground">
                                {searchLocation
                                  ? `No locations match "${searchLocation}"`
                                  : "No locations found"}
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredLocations.map((location, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-muted/30 cursor-pointer transition-colors"
                              onClick={() =>
                                handleLocationSelect(location.location)
                              }
                            >
                              <TableCell className="font-semibold">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-primary" />
                                  </div>
                                  {location.location}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  className={`${getStatusColor(
                                    selectedStatus || "",
                                  )} font-bold`}
                                >
                                  {location.count}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="font-semibold"
                                >
                                  View Details
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : selectedType === "RECURRING" && !selectedSerialNumber ? (
          // Target Systems List (RECURRING only)
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Back Button */}
            <div className="px-8 py-4 border-b border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToLocations}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Locations
              </Button>
            </div>

            <div className="px-8 py-5 border-b border-border/40 bg-linear-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Server className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">Target Systems</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge
                        className={`${getStatusColor(selectedStatus || "")} font-bold capitalize`}
                      >
                        {getStatusIcon(selectedStatus || "")}
                        <span className="ml-1.5">{selectedStatus}</span>
                      </Badge>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="font-semibold">{selectedLocation}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-border/40 shadow-sm">
                  <p className="text-xs text-muted-foreground font-bold mb-1">
                    Total Systems
                  </p>
                  <p className="text-2xl font-black">
                    {targetSystemsData?.data?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 h-50">
              <div className="px-6 py-4">
                {loadingTargetSystems ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !targetSystemsData?.data ||
                  targetSystemsData.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl">
                    <Server className="h-14 w-14 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-semibold text-muted-foreground">
                      No target systems found
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50 rounded-xl border border-border/50 overflow-hidden bg-background">
                 
                    <div className="grid grid-cols-12 px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide bg-muted/40">
                      <div className="col-span-5">Host Name</div>
                      <div className="col-span-5">Serial Number</div>
                      <div className="col-span-2 text-right">Action</div>
                    </div>

                    {/* ROWS */}
                    {targetSystemsData.data.map(
                      (system: TargetSystem, index: number) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleSerialNumberSelect(system.systemSerialNumber)
                          }
                          className="group grid grid-cols-12 items-center px-4 py-4 cursor-pointer hover:bg-primary/5 transition-colors"
                        >
                          {/* HOST NAME */}
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Server className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground leading-tight">
                                {system.hostName || "Unknown Host"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Target System
                              </p>
                            </div>
                          </div>

                          {/* SERIAL NUMBER */}
                          <div className="col-span-5">
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                              {system.systemSerialNumber}
                            </span>
                          </div>

                          {/* EXECUTION COUNT */}
                          <div className="flex">
                            {/* {system.count !== undefined ? (
                  <span className="text-lg font-bold text-primary">
                    {system.count}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )} */}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          // Execution Results (both ONE_TIME and RECURRING after serial selection)
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Back Button */}
            <div className="px-8 py-4 border-b border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={
                  selectedType === "RECURRING"
                    ? handleBackToTargetSystems
                    : handleBackToLocations
                }
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {selectedType === "RECURRING"
                  ? "Back to Target Systems"
                  : "Back to Locations"}
              </Button>
            </div>

            <div className="px-8 py-5 border-b border-border/40 bg-linear-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Database className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">
                      Execution Results
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge
                        className={`${getStatusColor(selectedStatus || "")} font-bold capitalize`}
                      >
                        {getStatusIcon(selectedStatus || "")}
                        <span className="ml-1.5">{selectedStatus}</span>
                      </Badge>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="font-semibold">{selectedLocation}</span>
                      {selectedSerialNumber && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {selectedSerialNumber}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="Search by hostname..."
                    value={searchExecution}
                    onChange={(e) => setSearchExecution(e.target.value)}
                    className="pl-10 h-10 bg-white dark:bg-slate-800 rounded-lg border-border/50"
                  />
                </div>

                {/* Location Filter (ONE_TIME only) */}
                {selectedType === "ONE_TIME" && uniqueLocations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={selectedLocation}
                      onValueChange={(v) => handleLocationSelect(v)}
                    >
                      <SelectTrigger className="w-50 h-10">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationListData.map((loc: any) => (
                          <SelectItem key={loc?.location} value={loc?.location}>
                            {loc?.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
  {selectedType === "RECURRING" && targetSystemsData?.data?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={selectedSerialNumber}
                      onValueChange={(v) => handleSerialNumberSelect(v)}
                    >
                      <SelectTrigger className="w-50 h-10">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetSystemsData?.data?.map((system: any) => (
                          <SelectItem key={system.id} value={system.systemSerialNumber}>
                            {system.systemSerialNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}


                <Badge variant="outline" className="h-10 px-4 font-bold">
                  {filteredExecutions.length} execution
                  {filteredExecutions.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-4">
              {loadingOneTimeExecutions || loadingRecurringExecutions ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredExecutions.length === 0 ? (
                <Card className="border-2 border-dashed border-border/50 h-full flex items-center justify-center">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <Activity className="h-16 w-16 text-muted-foreground/20 mb-4" />
                    <p className="text-lg font-bold text-muted-foreground">
                      No executions found
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchExecution
                        ? `No matches for "${searchExecution}"`
                        : "No execution history available"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full">
                  <DataTable
                    rowData={paginatedExecutions}
                    colDefs={columnDefs}
                    isLoading={false}
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
              )}
            </div>
          </div>
        )}
      </main>

      {/* Log Viewer Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black">
                  Execution Log Details
                </DialogTitle>
                <DialogDescription className="flex items-center gap-3 mt-1">
                  <span className="font-semibold text-foreground">
                    {selectedExecution?.hostName}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  {selectedExecution && (
                    <Badge
                      className={`${getStatusColor(selectedExecution.status)} font-bold`}
                    >
                      {getStatusIcon(selectedExecution.status)}
                      <span className="ml-1.5">{selectedExecution.status}</span>
                    </Badge>
                  )}
                  <Separator orientation="vertical" className="h-4" />
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedExecution?.systemSerialNumber}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="h-110">
            <div className="p-6">
              {selectedExecution && (
                <div className="space-y-4">
                  {/* Execution Metadata */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Timer className="h-4 w-4" />
                          <span className="font-bold">Started At</span>
                        </div>
                        <p className="text-base font-semibold">
                          {new Date(
                            selectedExecution.startedAt,
                          ).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-bold">Finished At</span>
                        </div>
                        <p className="text-base font-semibold">
                          {selectedExecution.finishedAt
                            ? new Date(
                                selectedExecution.finishedAt,
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Hash className="h-4 w-4" />
                          <span className="font-bold">Return Code</span>
                        </div>
                        <Badge
                          variant={
                            selectedExecution.returnCode === 0
                              ? "default"
                              : "destructive"
                          }
                          className="font-mono text-base"
                        >
                          {selectedExecution.returnCode}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* STDOUT Log */}
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-3">
                      <Terminal className="h-4 w-4" />
                      Standard Output (stdout)
                    </div>

                    <div className="relative rounded-xl border border-border/40 bg-slate-950 dark:bg-slate-950/80 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-slate-900/80 to-transparent flex items-center px-4 gap-1.5 z-10">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="ml-3 text-[10px] font-mono text-slate-400">
                          stdout.log
                        </span>
                      </div>
                      <ScrollArea className="h-64">
                        <pre className="p-4 pt-10 text-xs font-mono leading-relaxed text-emerald-400 whitespace-pre-wrap wrap-break-word">
                          {selectedExecution.stdout || "# No output available"}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>

                  {/* STDERR Log */}
                  {selectedExecution.stderr && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-3">
                        <AlertCircle className="h-4 w-4" />
                        Standard Error (stderr)
                      </div>

                      <div className="relative rounded-xl border border-border/40 bg-slate-950 dark:bg-slate-950/80 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-slate-900/80 to-transparent flex items-center px-4 gap-1.5 z-10">
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="ml-3 text-[10px] font-mono text-slate-400">
                            stderr.log
                          </span>
                        </div>
                        <ScrollArea className="h-64">
                          <pre className="p-4 pt-10 text-xs font-mono leading-relaxed text-rose-400 whitespace-pre-wrap wrap-break-word">
                            {selectedExecution.stderr}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScriptExecutionDrillReport;

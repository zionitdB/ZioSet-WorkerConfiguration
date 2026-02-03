import { useState, useMemo } from "react";
import {
  useGetScriptTypeCount,
  useGetTargetSystemsCount,
  useGetExecutionsByScriptId,
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
  Play,
  Calendar,
  FileCode,
  BarChart3,
  Loader2,
  Download,
  Filter,
  AlertCircle,
  Zap,
  Target,
  Layers,
  Code,
  GitBranch,
  Box,
  Cpu,
  Hash,
  Timer,
  RefreshCw,
  Maximize2,
  ChevronDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ScriptType = "ONE_TIME" | "RECURRING" | "ALL";

interface Script {
  scriptId: number;
  scriptName: string;
  targetCount: number;
}

interface Execution {
  id: number;
  hostName: string;
  status: string;
  startedAt: string;
  stdout: string;
  endedAt?: string;
}

const ScriptExecutionDrillReport = () => {
  const { data: typeCount, isLoading: loadingTypeCount } = useGetScriptTypeCount();
  const { data: targetData, isLoading: loadingTargets } = useGetTargetSystemsCount();

  const [selectedType, setSelectedType] = useState<ScriptType>("ALL");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [searchScript, setSearchScript] = useState<string>("");
  const [searchExecution, setSearchExecution] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: executions, isLoading: loadingExecutions } = useGetExecutionsByScriptId(
    selectedScript?.scriptId
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
    s.scriptName.toLowerCase().includes(searchScript.toLowerCase())
  );

  const filteredExecutions = (executions || []).filter((e: Execution) => {
    const matchesSearch = e.hostName.toLowerCase().includes(searchExecution.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'failed':
      case 'error':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'running':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalOneTime = typeCount?.oneTimeCount || 0;
  const totalRecurring = typeCount?.recurringCount || 0;
  const totalScripts = totalOneTime + totalRecurring;

  const successCount = (executions || []).filter((e: { status: string; }) => e.status.toLowerCase() === 'success').length;
  const failedCount = (executions || []).filter((e: { status: string; }) => e.status.toLowerCase() === 'failed' || e.status.toLowerCase() === 'error').length;
  const successRate = executions?.length ? ((successCount / executions.length) * 100).toFixed(1) : '0';

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950">
      
      {/* LEFT SIDEBAR - Script Navigator */}
      <aside className="w-[420px] border-r border-border/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">Script Navigator</h2>
              <p className="text-xs text-muted-foreground font-medium">Browse & select scripts</p>
            </div>
          </div>

          {/* Type Filter Tabs */}
        <div className="relative w-full max-w-md">
  <div className="grid grid-cols-2 p-1 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-inner">

    {/* Animated slider */}
    <div
      className={`absolute top-1 bottom-1 w-1/2 rounded-xl bg-white dark:bg-slate-700 shadow-lg transition-all duration-300 ease-out ${
        selectedType === "ONE_TIME"
          ? "left-1"
          : "left-1/2"
      }`}
    />

    <button
      onClick={() => setSelectedType("ONE_TIME")}
      className="relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors"
    >
      <span className="block">One-Time</span>
      <span className="text-xs opacity-70">
        {totalOneTime} scripts
      </span>
    </button>

    <button
      onClick={() => setSelectedType("RECURRING")}
      className="relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors"
    >
      <span className="block">Recurring</span>
      <span className="text-xs opacity-70">
        {totalRecurring} scripts
      </span>
    </button>
  </div>
</div>


          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search scripts..."
              value={searchScript}
              onChange={(e) => setSearchScript(e.target.value)}
              className="pl-10 h-10 bg-white dark:bg-slate-800 rounded-lg border-border/50"
            />
          </div>
        </div>

        {/* Scripts List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {loadingTargets ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredScripts.length === 0 ? (
              <div className="text-center py-20">
                <Terminal className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">No scripts found</p>
              </div>
            ) : (
              filteredScripts.map((script: Script) => (
                <button
                  key={script.scriptId}
                  onClick={() => setSelectedScript(script)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedScript?.scriptId === script.scriptId
                      ? "bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/30 shadow-lg"
                      : "bg-white dark:bg-slate-800/50 border border-border/40 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        selectedScript?.scriptId === script.scriptId
                          ? "bg-primary/20"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}>
                        <FileCode className={`h-4 w-4 ${
                          selectedScript?.scriptId === script.scriptId
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`} />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {script.targetCount} {script.targetCount === 1 ? 'target' : 'targets'}
                    </Badge>
                  </div>
                  <h3 className={`font-bold text-sm line-clamp-2 ${
                    selectedScript?.scriptId === script.scriptId
                      ? "text-primary"
                      : "text-foreground"
                  }`}>
                    {script.scriptName}
                  </h3>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-20 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl" />
                <div className="relative h-14 w-14 bg-gradient-to-br from-primary via-primary to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-primary/30">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black">Execution Intelligence</h1>
                <p className="text-sm text-muted-foreground font-medium">Real-time script execution monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg font-semibold">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg font-semibold">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* Content */}
        {!selectedScript ? (
          // Dashboard Overview
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-black mb-2">Dashboard Overview</h2>
                  <p className="text-muted-foreground font-medium">System-wide execution metrics and insights</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Scripts */}
                  <Card className="border-border/40 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Total Scripts</p>
                      <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{totalScripts}</p>
                    </CardContent>
                  </Card>

                  {/* One-Time */}
                  <Card className="border-border/40 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">One-Time</p>
                      <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{totalOneTime}</p>
                    </CardContent>
                  </Card>

                  {/* Recurring */}
                  <Card className="border-border/40 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <Repeat className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <GitBranch className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Recurring</p>
                      <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{totalRecurring}</p>
                    </CardContent>
                  </Card>

                  {/* Active */}
                  <Card className="border-border/40 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Active Now</p>
                      <p className="text-4xl font-black text-orange-600 dark:text-orange-400">-</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Card */}
                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <Box className="h-16 w-16 mx-auto text-primary/40 mb-4" />
                    <h3 className="text-xl font-black mb-2">Select a Script to Begin</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choose a script from the left sidebar to view detailed execution history, logs, and performance metrics.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        ) : (
          // Execution Details
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Script Header */}
            <div className="px-8 py-6 border-b border-border/40 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Terminal className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">{selectedScript.scriptName}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-4 w-4" />
                        <span className="font-semibold">{selectedScript.targetCount} targets</span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-1.5">
                        <Play className="h-4 w-4" />
                        <span className="font-semibold">{executions?.length || 0} executions</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Success Rate */}
                  <div className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-border/40 shadow-sm">
                    <p className="text-xs text-muted-foreground font-bold mb-1">Success Rate</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{successRate}%</p>
                  </div>

                  {/* Stats */}
                  <div className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-border/40 shadow-sm">
                    <p className="text-xs text-muted-foreground font-bold mb-1">Success / Failed</p>
                    <p className="text-lg font-black">
                      <span className="text-emerald-600 dark:text-emerald-400">{successCount}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-rose-600 dark:text-rose-400">{failedCount}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 h-10 rounded-lg">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                  </SelectContent>
                </Select>

                <Badge variant="outline" className="h-10 px-4 font-bold">
                  {filteredExecutions.length} result{filteredExecutions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            {/* Executions List */}
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-4">
                {loadingExecutions ? (
                  <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : filteredExecutions.length === 0 ? (
                  <Card className="border-2 border-dashed border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-20">
                      <Activity className="h-16 w-16 text-muted-foreground/20 mb-4" />
                      <p className="text-lg font-bold text-muted-foreground">No executions found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchExecution ? `No matches for "${searchExecution}"` : 'No execution history available'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredExecutions.map((execution: Execution, index: number) => (
                    <Card key={execution.id} className="border border-border/40 hover:border-primary/40 transition-all bg-white dark:bg-slate-900 overflow-hidden group">
                      <CardHeader className="p-5 pb-4 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                              <Server className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-base flex items-center gap-2 mb-1">
                                {execution.hostName}
                                <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Timer className="h-3 w-3" />
                                {new Date(execution.startedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <Badge className={`${getStatusColor(execution.status)} px-3 py-1.5 font-bold border flex items-center gap-1.5`}>
                            {getStatusIcon(execution.status)}
                            {execution.status}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                            <Terminal className="h-4 w-4" />
                            Output Log
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs">
                            <Maximize2 className="h-3 w-3 mr-1.5" />
                            Expand
                          </Button>
                        </div>
                        
                        <div className="relative rounded-xl border border-border/40 bg-slate-950 dark:bg-slate-950/80 overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900/80 to-transparent flex items-center px-4 gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span className="ml-3 text-[10px] font-mono text-slate-400">output.log</span>
                          </div>
                          <ScrollArea className="h-56">
                            <pre className="p-4 pt-10 text-xs font-mono leading-relaxed text-emerald-400 whitespace-pre-wrap break-words">
                              {execution.stdout || '# No output available'}
                            </pre>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScriptExecutionDrillReport;
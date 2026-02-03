





// import { useState, useMemo } from "react";

// import {
//   useGetScriptTypeCount,
//   useGetTargetSystemsCount,
//   useGetExecutionsByScriptId,
// } from "./hooks";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import {
//   Search,
//   Clock,
//   Repeat,
//   Terminal,
//   Server,
//   CheckCircle2,
//   XCircle,
//   TrendingUp,
//   Activity,
//   Play,
//   FileCode,
//   BarChart3,
//   Loader2,
//   Download,
//   AlertCircle,
//   Zap,
//   Target,
//   Layers,
//   Code,
//   GitBranch,
//   Box,
//   Hash,
//   Timer,
//   RefreshCw,
//   Maximize2,
//   MapPin,
//   ChevronRight,
//   ArrowRight,
//   Database
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// type ScriptType = "ONE_TIME" | "RECURRING" | "ALL";
// type StatusType = "success" | "failed" | "pending" | "all";

// interface Script {
//   scriptId: number;
//   scriptName: string;
//   targetCount: number;
// }

// interface Execution {
//   id: number;
//   hostName: string;
//   status: string;
//   startedAt: string;
//   stdout: string;
//   endedAt?: string;
//   location?: string;
// }

// // Demo data for locations grouped by status
// const generateDemoLocations = (status: StatusType) => {
//   if (status === "all") return [];
  
//   const locationMap = {
//     success: [
//       { location: "US-East-1 (Virginia)", count: 45, lastRun: "2024-02-03T14:30:00" },
//       { location: "EU-West-1 (Ireland)", count: 38, lastRun: "2024-02-03T14:25:00" },
//       { location: "AP-South-1 (Mumbai)", count: 52, lastRun: "2024-02-03T14:20:00" },
//       { location: "US-West-2 (Oregon)", count: 41, lastRun: "2024-02-03T14:15:00" },
//     ],
//     failed: [
//       { location: "US-East-2 (Ohio)", count: 8, lastRun: "2024-02-03T13:45:00" },
//       { location: "EU-Central-1 (Frankfurt)", count: 5, lastRun: "2024-02-03T13:30:00" },
//       { location: "AP-Southeast-1 (Singapore)", count: 3, lastRun: "2024-02-03T13:15:00" },
//     ],
//     pending: [
//       { location: "US-West-1 (California)", count: 12, lastRun: "2024-02-03T15:00:00" },
//       { location: "EU-North-1 (Stockholm)", count: 9, lastRun: "2024-02-03T14:55:00" },
//       { location: "AP-Northeast-1 (Tokyo)", count: 7, lastRun: "2024-02-03T14:50:00" },
//     ],
//   };
  
//   return locationMap[status] || [];
// };

// // Demo executions for a location
// const generateDemoExecutions = (location: string, status: StatusType): Execution[] => {
//   const baseExecutions = [
//     { id: 1, hostName: "server-prod-01", status: status === "all" ? "success" : status, startedAt: "2024-02-03T14:30:00", stdout: "Execution completed successfully\nAll tasks processed\nMemory usage: 45%\nCPU usage: 32%", location },
//     { id: 2, hostName: "server-prod-02", status: status === "all" ? "success" : status, startedAt: "2024-02-03T14:28:00", stdout: "Starting script execution...\nConnecting to database...\nProcessing records...\nCompleted", location },
//     { id: 3, hostName: "server-prod-03", status: status === "all" ? "failed" : status, startedAt: "2024-02-03T14:25:00", stdout: "Error: Connection timeout\nRetrying...\nFailed after 3 attempts", location },
//     { id: 4, hostName: "server-prod-04", status: status === "all" ? "success" : status, startedAt: "2024-02-03T14:22:00", stdout: "Batch processing initiated\n1000 records processed\nValidation passed", location },
//     { id: 5, hostName: "server-prod-05", status: status === "all" ? "pending" : status, startedAt: "2024-02-03T14:20:00", stdout: "Queued for execution\nWaiting for resources...", location },
//   ];
  
//   return baseExecutions;
// };

// const ScriptExecutionDrillReport = () => {
//   const { data: typeCount, isLoading: loadingTypeCount } = useGetScriptTypeCount();
//   const { data: targetData, isLoading: loadingTargets } = useGetTargetSystemsCount();

//   const [selectedType, setSelectedType] = useState<ScriptType>("ALL");
//   const [selectedScript, setSelectedScript] = useState<Script | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
//   const [searchScript, setSearchScript] = useState<string>("");
//   const [searchLocation, setSearchLocation] = useState<string>("");
//   const [searchExecution, setSearchExecution] = useState<string>("");

// //   const { data: executions, isLoading: loadingExecutions } = useGetExecutionsByScriptId(
// //     selectedScript?.scriptId
// //   );

//   // Combine all scripts
//   const allScripts = useMemo(() => {
//     const oneTime = targetData?.data?.OneTimeList || [];
//     const recurring = targetData?.data?.Recurring || [];
    
//     if (selectedType === "ONE_TIME") return oneTime;
//     if (selectedType === "RECURRING") return recurring;
//     return [...oneTime, ...recurring];
//   }, [targetData, selectedType]);

//   const filteredScripts = allScripts.filter((s: Script) =>
//     s.scriptName.toLowerCase().includes(searchScript.toLowerCase())
//   );

//   // Demo: Get locations for selected status
//   const locations = useMemo(() => {
//     if (!selectedScript || !selectedStatus) return [];
//     return generateDemoLocations(selectedStatus);
//   }, [selectedScript, selectedStatus]);

//   const filteredLocations = locations.filter(loc =>
//     loc.location.toLowerCase().includes(searchLocation.toLowerCase())
//   );

//   // Demo: Get executions for selected location
//   const locationExecutions = useMemo(() => {
//     if (!selectedLocation || !selectedStatus) return [];
//     return generateDemoExecutions(selectedLocation, selectedStatus);
//   }, [selectedLocation, selectedStatus]);

//   const filteredExecutions = locationExecutions.filter((e: Execution) =>
//     e.hostName.toLowerCase().includes(searchExecution.toLowerCase())
//   );

//   // Calculate status counts (demo data)
//   const statusCounts = useMemo(() => {
//     if (!selectedScript) return { success: 0, failed: 0, pending: 0 };
//     return {
//       success: 135,
//       failed: 16,
//       pending: 28
//     };
//   }, [selectedScript]);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'success':
//         return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
//       case 'failed':
//       case 'error':
//         return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
//       case 'running':
//       case 'pending':
//         return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
//       default:
//         return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'success':
//         return <CheckCircle2 className="h-4 w-4" />;
//       case 'failed':
//       case 'error':
//         return <XCircle className="h-4 w-4" />;
//       case 'running':
//       case 'pending':
//         return <Loader2 className="h-4 w-4 animate-spin" />;
//       default:
//         return <AlertCircle className="h-4 w-4" />;
//     }
//   };

//   const totalOneTime = typeCount?.oneTimeCount || 0;
//   const totalRecurring = typeCount?.recurringCount || 0;
//   const totalScripts = totalOneTime + totalRecurring;

//   const handleScriptSelect = (script: Script) => {
//     setSelectedScript(script);
//     setSelectedStatus(null);
//     setSelectedLocation(null);
//     setSearchLocation("");
//     setSearchExecution("");
//   };

//   const handleStatusSelect = (status: StatusType) => {
//     setSelectedStatus(status);
//     setSelectedLocation(null);
//     setSearchLocation("");
//     setSearchExecution("");
//   };

//   const handleLocationSelect = (location: string) => {
//     setSelectedLocation(location);
//     setSearchExecution("");
//   };

//   return (
//     <div className="h-screen flex bg-slate-50 dark:bg-slate-950">
      
//       {/* LEFT SIDEBAR - Script Navigator */}
//       <aside className="w-[420px] border-r border-border/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col shrink-0">
//         {/* Sidebar Header */}
//         <div className="p-6 border-b border-border/40">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
//               <Layers className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-black">Script Navigator</h2>
//               <p className="text-xs text-muted-foreground font-medium">Browse & select scripts</p>
//             </div>
//           </div>

//           {/* Type Filter Tabs */}
//           <div className="relative w-full">
//             <div className="grid grid-cols-2 p-1 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-inner">
//               {/* Animated slider */}
//               <div
//                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white dark:bg-slate-700 shadow-lg transition-all duration-300 ease-out ${
//                   selectedType === "ONE_TIME"
//                     ? "left-1"
//                     : "left-[calc(50%+2px)]"
//                 }`}
//               />

//               <button
//                 onClick={() => setSelectedType("ONE_TIME")}
//                 className="relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors"
//               >
//                 <span className="block">One-Time</span>
//                 <span className="text-xs opacity-70">
//                   {totalOneTime} scripts
//                 </span>
//               </button>

//               <button
//                 onClick={() => setSelectedType("RECURRING")}
//                 className="relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors"
//               >
//                 <span className="block">Recurring</span>
//                 <span className="text-xs opacity-70">
//                   {totalRecurring} scripts
//                 </span>
//               </button>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative mt-4">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
//             <Input
//               placeholder="Search scripts..."
//               value={searchScript}
//               onChange={(e) => setSearchScript(e.target.value)}
//               className="pl-10 h-10 bg-white dark:bg-slate-800 rounded-lg border-border/50"
//             />
//           </div>
//         </div>

//         {/* Scripts List */}
//         <ScrollArea className="flex-1">
//           <div className="p-4 space-y-2">
//             {loadingTargets ? (
//               <div className="flex items-center justify-center py-20">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//               </div>
//             ) : filteredScripts.length === 0 ? (
//               <div className="text-center py-20">
//                 <Terminal className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
//                 <p className="text-sm font-semibold text-muted-foreground">No scripts found</p>
//               </div>
//             ) : (
//               filteredScripts.map((script: Script) => (
//                 <button
//                   key={script.scriptId}
//                   onClick={() => handleScriptSelect(script)}
//                   className={`w-full text-left p-4 rounded-xl transition-all ${
//                     selectedScript?.scriptId === script.scriptId
//                       ? "bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/30 shadow-lg"
//                       : "bg-white dark:bg-slate-800/50 border border-border/40 hover:border-primary/30 hover:shadow-md"
//                   }`}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
//                         selectedScript?.scriptId === script.scriptId
//                           ? "bg-primary/20"
//                           : "bg-slate-100 dark:bg-slate-700"
//                       }`}>
//                         <FileCode className={`h-4 w-4 ${
//                           selectedScript?.scriptId === script.scriptId
//                             ? "text-primary"
//                             : "text-muted-foreground"
//                         }`} />
//                       </div>
//                     </div>
//                     <Badge variant="outline" className="text-[10px] font-bold">
//                       {script.targetCount} {script.targetCount === 1 ? 'target' : 'targets'}
//                     </Badge>
//                   </div>
//                   <h3 className={`font-bold text-sm line-clamp-2 ${
//                     selectedScript?.scriptId === script.scriptId
//                       ? "text-primary"
//                       : "text-foreground"
//                   }`}>
//                     {script.scriptName}
//                   </h3>
//                 </button>
//               ))
//             )}
//           </div>
//         </ScrollArea>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col overflow-hidden">
        
//         {/* Top Header Bar */}
//         <header className="h-20 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-8 flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl" />
//                 <div className="relative h-14 w-14 bg-gradient-to-br from-primary via-primary to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-primary/30">
//                   <BarChart3 className="h-7 w-7 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-black">Execution Intelligence</h1>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   Deep-dive script execution analysis
//                   {selectedScript && (
//                     <>
//                       <ChevronRight className="inline h-3 w-3 mx-1" />
//                       <span className="font-semibold">{selectedScript.scriptName}</span>
//                     </>
//                   )}
//                   {selectedStatus && selectedStatus !== "all" && (
//                     <>
//                       <ChevronRight className="inline h-3 w-3 mx-1" />
//                       <span className="font-semibold capitalize">{selectedStatus}</span>
//                     </>
//                   )}
//                   {selectedLocation && (
//                     <>
//                       <ChevronRight className="inline h-3 w-3 mx-1" />
//                       <span className="font-semibold">{selectedLocation}</span>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg font-semibold">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>
//             <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg font-semibold">
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//           </div>
//         </header>

//         {/* Content - Dashboard, Status Selection, Location List, or Execution Details */}
//         {!selectedScript ? (
//           // Dashboard Overview
//           <div className="flex-1 overflow-hidden">
//             <ScrollArea className="h-full">
//               <div className="p-8 space-y-6">
//                 <div>
//                   <h2 className="text-3xl font-black mb-2">Dashboard Overview</h2>
//                   <p className="text-muted-foreground font-medium">System-wide execution metrics and insights</p>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <Card className="border-border/40 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                           <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                         </div>
//                         <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <p className="text-sm font-bold text-muted-foreground mb-1">Total Scripts</p>
//                       <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{totalScripts}</p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-border/40 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                           <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//                         </div>
//                         <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//                       </div>
//                       <p className="text-sm font-bold text-muted-foreground mb-1">One-Time</p>
//                       <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{totalOneTime}</p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-border/40 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
//                           <Repeat className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//                         </div>
//                         <GitBranch className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//                       </div>
//                       <p className="text-sm font-bold text-muted-foreground mb-1">Recurring</p>
//                       <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{totalRecurring}</p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-border/40 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
//                           <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
//                         </div>
//                         <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
//                       </div>
//                       <p className="text-sm font-bold text-muted-foreground mb-1">Total Executions</p>
//                       <p className="text-4xl font-black text-orange-600 dark:text-orange-400">1.2K</p>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
//                   <CardContent className="p-8 text-center">
//                     <Box className="h-16 w-16 mx-auto text-primary/40 mb-4" />
//                     <h3 className="text-xl font-black mb-2">Select a Script to Begin</h3>
//                     <p className="text-muted-foreground max-w-md mx-auto">
//                       Choose a script from the left sidebar to drill down into execution status, locations, and detailed logs.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </ScrollArea>
//           </div>
//         ) : !selectedStatus ? (
//           // Status Selection - Continues in next message due to length
//           <div className="flex-1 overflow-hidden">
//             <ScrollArea className="h-full">
//               <div className="p-8 space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
//                     <Terminal className="h-8 w-8 text-primary" />
//                   </div>
//                   <div>
//                     <h2 className="text-3xl font-black mb-1">{selectedScript.scriptName}</h2>
//                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1.5">
//                         <Target className="h-4 w-4" />
//                         <span className="font-semibold">{selectedScript.targetCount} targets</span>
//                       </div>
//                       <Separator orientation="vertical" className="h-4" />
//                       <div className="flex items-center gap-1.5">
//                         <Activity className="h-4 w-4" />
//                         <span className="font-semibold">{statusCounts.success + statusCounts.failed + statusCounts.pending} executions</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-2xl font-black mb-2">Select Execution Status</h3>
//                   <p className="text-muted-foreground font-medium">Choose a status to view locations and detailed execution logs</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {[
//                     { type: "success", icon: CheckCircle2, gradient: "from-emerald-500 to-green-500", count: statusCounts.success, label: "Success", desc: "Completed successfully across all locations" },
//                     { type: "failed", icon: XCircle, gradient: "from-rose-500 to-red-500", count: statusCounts.failed, label: "Failed", desc: "Execution errors requiring attention" },
//                     { type: "pending", icon: Clock, gradient: "from-blue-500 to-cyan-500", count: statusCounts.pending, label: "Pending", desc: "Queued and waiting for execution" }
//                   ].map((status) => {
//                     const Icon = status.icon;
//                     return (
//                       <Card
//                         key={status.type}
//                         onClick={() => handleStatusSelect(status.type as StatusType)}
//                         className="group cursor-pointer border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900 hover:-translate-y-1"
//                       >
//                         <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${status.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        
//                         <CardHeader className="p-6">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="relative">
//                               <div className={`absolute inset-0 bg-gradient-to-r ${status.gradient} blur-2xl opacity-0 group-hover:opacity-50 transition-all rounded-2xl`} />
//                               <div className={`relative h-14 w-14 bg-gradient-to-br ${status.gradient.replace('from-', 'from-').replace('to-', 'to-').replace('500', '100')} dark:${status.gradient.replace('from-', 'from-').replace('to-', 'to-').replace('500', '950/50')} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg`}>
//                                 <Icon className={`h-7 w-7 ${status.gradient.replace('from-', 'text-').replace(' to-', '').replace('500', '600')} dark:${status.gradient.replace('from-', 'text-').replace(' to-', '').replace('500', '400')}`} />
//                               </div>
//                             </div>
//                             <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
//                           </div>
//                           <CardTitle className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors mb-2">
//                             {status.label}
//                           </CardTitle>
//                         </CardHeader>
                        
//                         <CardContent className="p-6 pt-0">
//                           <div className="flex items-baseline gap-2 mb-4">
//                             <p className={`text-5xl font-black bg-gradient-to-r ${status.gradient.replace('500', '600')} dark:${status.gradient.replace('500', '400')} bg-clip-text text-transparent`}>
//                               {status.count}
//                             </p>
//                             <p className="text-sm text-muted-foreground font-semibold">executions</p>
//                           </div>
//                           <p className="text-sm text-muted-foreground">{status.desc}</p>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               </div>
//             </ScrollArea>
//           </div>
//         ) : !selectedLocation ? (
//           // Location List
//           <div className="flex-1 flex flex-col overflow-hidden">
//             <div className="px-8 py-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-purple-500/5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-black mb-1 capitalize">{selectedStatus} Executions by Location</h2>
//                   <p className="text-sm text-muted-foreground font-medium">Select a location to view detailed execution logs</p>
//                 </div>
//                 <div className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-border/40 shadow-sm">
//                   <p className="text-xs text-muted-foreground font-bold mb-1">Total Locations</p>
//                   <p className="text-2xl font-black">{filteredLocations.length}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="px-8 py-4 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
//               <div className="flex items-center gap-4">
//                 <div className="relative flex-1 max-w-md">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
//                   <Input
//                     placeholder="Search locations..."
//                     value={searchLocation}
//                     onChange={(e) => setSearchLocation(e.target.value)}
//                     className="pl-10 h-10 bg-white dark:bg-slate-800 rounded-lg border-border/50"
//                   />
//                 </div>
//                 <Badge variant="outline" className="h-10 px-4 font-bold">
//                   {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
//                 </Badge>
//               </div>
//             </div>

//             <ScrollArea className="flex-1">
//               <div className="p-8">
//                 <Card className="border-border/40">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-muted/50">
//                         <TableHead className="font-black">Location</TableHead>
//                         <TableHead className="font-black text-center">Execution Count</TableHead>
//                         <TableHead className="font-black">Last Run</TableHead>
//                         <TableHead className="font-black text-right">Action</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredLocations.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={4} className="text-center py-20">
//                             <MapPin className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
//                             <p className="text-sm font-semibold text-muted-foreground">
//                               {searchLocation ? `No locations match "${searchLocation}"` : 'No locations found'}
//                             </p>
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         filteredLocations.map((location, index) => (
//                           <TableRow 
//                             key={index}
//                             className="hover:bg-muted/30 cursor-pointer transition-colors"
//                             onClick={() => handleLocationSelect(location.location)}
//                           >
//                             <TableCell className="font-semibold">
//                               <div className="flex items-center gap-3">
//                                 <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
//                                   <MapPin className="h-5 w-5 text-primary" />
//                                 </div>
//                                 {location.location}
//                               </div>
//                             </TableCell>
//                             <TableCell className="text-center">
//                               <Badge className={`${getStatusColor(selectedStatus || '')} font-bold`}>
//                                 {location.count}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-muted-foreground font-medium">
//                               {new Date(location.lastRun).toLocaleString()}
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <Button variant="ghost" size="sm" className="font-semibold">
//                                 View Details
//                                 <ArrowRight className="h-4 w-4 ml-2" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </Card>
//               </div>
//             </ScrollArea>
//           </div>
//         ) : (
//           // Execution Details
//           <div className="flex-1 flex flex-col overflow-hidden">
//             <div className="px-8 py-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-purple-500/5">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
//                     <Database className="h-7 w-7 text-primary" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-black mb-1">{selectedLocation}</h2>
//                     <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                       <Badge className={`${getStatusColor(selectedStatus || '')} font-bold capitalize`}>
//                         {getStatusIcon(selectedStatus || '')}
//                         <span className="ml-1.5">{selectedStatus}</span>
//                       </Badge>
//                       <Separator orientation="vertical" className="h-4" />
//                       <span className="font-semibold">{filteredExecutions.length} executions</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="px-8 py-4 border-b border-border/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
//               <div className="flex items-center gap-4">
//                 <div className="relative flex-1 max-w-md">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
//                   <Input
//                     placeholder="Search by hostname..."
//                     value={searchExecution}
//                     onChange={(e) => setSearchExecution(e.target.value)}
//                     className="pl-10 h-10 bg-white dark:bg-slate-800 rounded-lg border-border/50"
//                   />
//                 </div>
//                 <Badge variant="outline" className="h-10 px-4 font-bold">
//                   {filteredExecutions.length} execution{filteredExecutions.length !== 1 ? 's' : ''}
//                 </Badge>
//               </div>
//             </div>

//             <ScrollArea className="flex-1">
//               <div className="p-8">
//                 {filteredExecutions.length === 0 ? (
//                   <Card className="border-2 border-dashed border-border/50">
//                     <CardContent className="flex flex-col items-center justify-center py-20">
//                       <Activity className="h-16 w-16 text-muted-foreground/20 mb-4" />
//                       <p className="text-lg font-bold text-muted-foreground">No executions found</p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {searchExecution ? `No matches for "${searchExecution}"` : 'No execution history available'}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {filteredExecutions.map((execution: Execution, index: number) => (
//                       <Card key={execution.id} className="border border-border/40 hover:border-primary/40 transition-all bg-white dark:bg-slate-900 overflow-hidden">
//                         <CardHeader className="p-5 pb-4 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4">
//                               <div className="h-10 w-10 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
//                                 <Server className="h-5 w-5 text-primary" />
//                               </div>
//                               <div>
//                                 <h3 className="font-bold text-base flex items-center gap-2 mb-1">
//                                   {execution.hostName}
//                                   <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
//                                 </h3>
//                                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                                   <Timer className="h-3 w-3" />
//                                   {new Date(execution.startedAt).toLocaleString()}
//                                 </div>
//                               </div>
//                             </div>

//                             <Badge className={`${getStatusColor(execution.status)} px-3 py-1.5 font-bold border flex items-center gap-1.5`}>
//                               {getStatusIcon(execution.status)}
//                               {execution.status}
//                             </Badge>
//                           </div>
//                         </CardHeader>

//                         <CardContent className="p-5 pt-4">
//                           <div className="flex items-center justify-between mb-3">
//                             <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
//                               <Terminal className="h-4 w-4" />
//                               Output Log
//                             </div>
//                             <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs">
//                               <Maximize2 className="h-3 w-3 mr-1.5" />
//                               Expand
//                             </Button>
//                           </div>
                          
//                           <div className="relative rounded-xl border border-border/40 bg-slate-950 dark:bg-slate-950/80 overflow-hidden">
//                             <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900/80 to-transparent flex items-center px-4 gap-1.5 z-10">
//                               <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
//                               <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
//                               <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
//                               <span className="ml-3 text-[10px] font-mono text-slate-400">output.log</span>
//                             </div>
//                             <ScrollArea className="h-56">
//                               <pre className="p-4 pt-10 text-xs font-mono leading-relaxed text-emerald-400 whitespace-pre-wrap break-words">
//                                 {execution.stdout || '# No output available'}
//                               </pre>
//                             </ScrollArea>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ScriptExecutionDrillReport;










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
  FileCode,
  BarChart3,
  Loader2,
  Download,
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
  Maximize2,
  MapPin,
  ChevronRight,
  ArrowRight,
  Database,
  Eye
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
import DataTable from "@/components/common/DataTable";

type ScriptType = "ONE_TIME" | "RECURRING" | "ALL";
type StatusType = "success" | "failed" | "pending" | "all";

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
  location?: string;
}

// Demo data for locations grouped by status
const generateDemoLocations = (status: StatusType) => {
  if (status === "all") return [];
  
  const locationMap = {
    success: [
      { location: "US-East-1 (Virginia)", count: 45, lastRun: "2024-02-03T14:30:00" },
      { location: "EU-West-1 (Ireland)", count: 38, lastRun: "2024-02-03T14:25:00" },
      { location: "AP-South-1 (Mumbai)", count: 52, lastRun: "2024-02-03T14:20:00" },
      { location: "US-West-2 (Oregon)", count: 41, lastRun: "2024-02-03T14:15:00" },
    ],
    failed: [
      { location: "US-East-2 (Ohio)", count: 8, lastRun: "2024-02-03T13:45:00" },
      { location: "EU-Central-1 (Frankfurt)", count: 5, lastRun: "2024-02-03T13:30:00" },
      { location: "AP-Southeast-1 (Singapore)", count: 3, lastRun: "2024-02-03T13:15:00" },
    ],
    pending: [
      { location: "US-West-1 (California)", count: 12, lastRun: "2024-02-03T15:00:00" },
      { location: "EU-North-1 (Stockholm)", count: 9, lastRun: "2024-02-03T14:55:00" },
      { location: "AP-Northeast-1 (Tokyo)", count: 7, lastRun: "2024-02-03T14:50:00" },
    ],
  };
  
  return locationMap[status] || [];
};

// Demo executions for a location
const generateDemoExecutions = (location: string, status: StatusType): Execution[] => {
  const baseExecutions = [
    { id: 1, hostName: "server-prod-01", status: status === "all" ? "success" : status, startedAt: "2024-02-03T14:30:00", stdout: "Execution completed successfully\nAll tasks processed\nMemory usage: 45%\nCPU usage: 32%", location },
    { id: 2, hostName: "server-prod-02", status: status === "all" ? "success" : status, startedAt: "2024-02-03T14:28:00", stdout: "Starting script execution...\nConnecting to database...\nProcessing records...\nCompleted", location },
    { id: 3, hostName: "server-prod-03", status: status === "all" ? "failed" : status, startedAt: "2024-02-03T14:25:00", stdout: "Error: Connection timeout\nRetrying...\nFailed after 3 attempts", location },
    { id: 4, hostName: "server-prod-04", status: status === "all" ? "success" : status, startedAt: "2024-02-03T14:22:00", stdout: "Batch processing initiated\n1000 records processed\nValidation passed", location },
    { id: 5, hostName: "server-prod-05", status: status === "all" ? "pending" : status, startedAt: "2024-02-03T14:20:00", stdout: "Queued for execution\nWaiting for resources...", location },
  ];
  
  return baseExecutions;
};

const ScriptExecutionDrillReport = () => {
  const { data: typeCount, isLoading: loadingTypeCount } = useGetScriptTypeCount();
  const { data: targetData, isLoading: loadingTargets } = useGetTargetSystemsCount();

  const [selectedType, setSelectedType] = useState<ScriptType>("ONE_TIME");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const [searchScript, setSearchScript] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchExecution, setSearchExecution] = useState<string>("");
  
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState<boolean>(false);

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

  // Demo: Get locations for selected status
  const locations = useMemo(() => {
    if (!selectedScript || !selectedStatus) return [];
    return generateDemoLocations(selectedStatus);
  }, [selectedScript, selectedStatus]);

  const filteredLocations = locations.filter(loc =>
    loc.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Demo: Get executions for selected location
  const locationExecutions = useMemo(() => {
    if (!selectedLocation || !selectedStatus) return [];
    return generateDemoExecutions(selectedLocation, selectedStatus);
  }, [selectedLocation, selectedStatus]);

  const filteredExecutions = locationExecutions.filter((e: Execution) =>
    e.hostName.toLowerCase().includes(searchExecution.toLowerCase())
  );

  // Calculate status counts (demo data)
  const statusCounts = useMemo(() => {
    if (!selectedScript) return { success: 0, failed: 0, pending: 0 };
    return {
      success: 135,
      failed: 16,
      pending: 28
    };
  }, [selectedScript]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'failed':
      case 'error':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'running':
      case 'pending':
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
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalOneTime = typeCount?.oneTimeCount || 0;
  const totalRecurring = typeCount?.recurringCount || 0;
  const totalScripts = totalOneTime + totalRecurring;

  const handleScriptSelect = (script: Script) => {
    setSelectedScript(script);
    setSelectedStatus(null);
    setSelectedLocation(null);
    setSearchLocation("");
    setSearchExecution("");
  };

  const handleStatusSelect = (status: StatusType) => {
    setSelectedStatus(status);
    setSelectedLocation(null);
    setSearchLocation("");
    setSearchExecution("");
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setSearchExecution("");
    setPage(1);
  };

  const handleViewLog = (execution: Execution) => {
    setSelectedExecution(execution);
    setIsLogDialogOpen(true);
  };

  // AG Grid Column Definitions
  const columnDefs: ColDef<Execution>[] = [
    {
      field: "id",
      headerName: "#",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center h-full">
            <span className="font-bold text-muted-foreground">#{params.value}</span>
          </div>
        );
      }
    },
    {
      field: "hostName",
      headerName: "Host Name",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-3 h-full">
            <div className="h-8 w-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Server className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">{params.value}</span>
          </div>
        );
      }
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      cellRenderer: (params: any) => {
        const status = params.value;
        return (
          <div className="flex items-center justify-center h-full">
            <Badge className={`${getStatusColor(status)} px-3 py-1 font-bold border flex items-center gap-1.5`}>
              {getStatusIcon(status)}
              {status}
            </Badge>
          </div>
        );
      }
    },
    {
      field: "startedAt",
      headerName: "Started At",
      width: 200,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-2 h-full text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            <span className="font-medium">{new Date(params.value).toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      field: "location",
      headerName: "Location",
      width: 180,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-2 h-full">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{params.value}</span>
          </div>
        );
      }
    },
    {
      headerName: "Actions",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center gap-2 h-full">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3"
              onClick={() => handleViewLog(params.data)}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View Log
            </Button>
          </div>
        );
      }
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(filteredExecutions.length / rowsPerPage);
  const paginatedExecutions = filteredExecutions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="h-screen flex ">
      
      {/* LEFT SIDEBAR - Script Navigator */}
      <aside className="w-[420px] sticky border-r border-border/40 bg-white/80 dark:bg-background backdrop-blur-xl flex flex-col shrink-0">
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
          <div className="relative w-full">
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-inner">
              {/* Animated slider */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white dark:bg-slate-700 shadow-lg transition-all duration-300 ease-out ${
                  selectedType === "ONE_TIME"
                    ? "left-1"
                    : "left-[calc(50%+2px)]"
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
        <ScrollArea className="flex-1 h-40">
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
                  onClick={() => handleScriptSelect(script)}
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
                <p className="text-sm text-muted-foreground font-medium">
                  Deep-dive script execution analysis
                  {selectedScript && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold">{selectedScript.scriptName}</span>
                    </>
                  )}
                  {selectedStatus && selectedStatus !== "all" && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold capitalize">{selectedStatus}</span>
                    </>
                  )}
                  {selectedLocation && (
                    <>
                      <ChevronRight className="inline h-3 w-3 mx-1" />
                      <span className="font-semibold">{selectedLocation}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg font-semibold">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {/* <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg font-semibold">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>
        </header>

        {/* Content - Dashboard, Status Selection, Location List, or Execution Details */}
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

                  <Card className="border-border/40 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Total Executions</p>
                      <p className="text-4xl font-black text-orange-600 dark:text-orange-400">1.2K</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <Box className="h-16 w-16 mx-auto text-primary/40 mb-4" />
                    <h3 className="text-xl font-black mb-2">Select a Script to Begin</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choose a script from the left sidebar to drill down into execution status, locations, and detailed logs.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        ) : !selectedStatus ? (
          // Status Selection - Continues in next message due to length
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Terminal className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black mb-1">{selectedScript.scriptName}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-4 w-4" />
                        <span className="font-semibold">{selectedScript.targetCount} targets</span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span className="font-semibold">{statusCounts.success + statusCounts.failed + statusCounts.pending} executions</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black mb-2">Select Execution Status</h3>
                  <p className="text-muted-foreground font-medium">Choose a status to view locations and detailed execution logs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: "success", icon: CheckCircle2, gradient: "from-emerald-500 to-green-500", count: statusCounts.success, label: "Success", desc: "Completed successfully across all locations" },
                    { type: "failed", icon: XCircle, gradient: "from-rose-500 to-red-500", count: statusCounts.failed, label: "Failed", desc: "Execution errors requiring attention" },
                    { type: "pending", icon: Clock, gradient: "from-blue-500 to-cyan-500", count: statusCounts.pending, label: "Pending", desc: "Queued and waiting for execution" }
                  ].map((status) => {
                    const Icon = status.icon;
                    return (
                      <Card
                        key={status.type}
                        onClick={() => handleStatusSelect(status.type as StatusType)}
                        className="group cursor-pointer border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900 hover:-translate-y-1"
                      >
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${status.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        
                        <CardHeader className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="relative">
                              <div className={`absolute inset-0 bg-gradient-to-r ${status.gradient} blur-2xl opacity-0 group-hover:opacity-50 transition-all rounded-2xl`} />
                              <div className={`relative h-14 w-14 bg-gradient-to-br ${status.gradient.replace('from-', 'from-').replace('to-', 'to-').replace('500', '100')} dark:${status.gradient.replace('from-', 'from-').replace('to-', 'to-').replace('500', '950/50')} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg`}>
                                <Icon className={`h-7 w-7 ${status.gradient.replace('from-', 'text-').replace(' to-', '').replace('500', '600')} dark:${status.gradient.replace('from-', 'text-').replace(' to-', '').replace('500', '400')}`} />
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
                            <p className={`text-5xl font-black bg-gradient-to-r ${status.gradient.replace('500', '600')} dark:${status.gradient.replace('500', '400')} bg-clip-text text-transparent`}>
                              {status.count}
                            </p>
                            <p className="text-sm text-muted-foreground font-semibold">executions</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{status.desc}</p>
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
            <div className="px-8 py-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black mb-1 capitalize">{selectedStatus} Executions by Location</h2>
                  <p className="text-sm text-muted-foreground font-medium">Select a location to view detailed execution logs</p>
                </div>
                <div className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-border/40 shadow-sm">
                  <p className="text-xs text-muted-foreground font-bold mb-1">Total Locations</p>
                  <p className="text-2xl font-black">{filteredLocations.length}</p>
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
                  {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-8">
                <Card className="border-border/40">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-black">Location</TableHead>
                        <TableHead className="font-black text-center">Execution Count</TableHead>
                        <TableHead className="font-black">Last Run</TableHead>
                        <TableHead className="font-black text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLocations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-20">
                            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                            <p className="text-sm font-semibold text-muted-foreground">
                              {searchLocation ? `No locations match "${searchLocation}"` : 'No locations found'}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLocations.map((location, index) => (
                          <TableRow 
                            key={index}
                            className="hover:bg-muted/30 cursor-pointer transition-colors"
                            onClick={() => handleLocationSelect(location.location)}
                          >
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                  <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                {location.location}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${getStatusColor(selectedStatus || '')} font-bold`}>
                                {location.count}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground font-medium">
                              {new Date(location.lastRun).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="font-semibold">
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
              </div>
            </ScrollArea>
          </div>
        ) : (
          // Execution Details with DataTable
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <Database className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">{selectedLocation}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge className={`${getStatusColor(selectedStatus || '')} font-bold capitalize`}>
                        {getStatusIcon(selectedStatus || '')}
                        <span className="ml-1.5">{selectedStatus}</span>
                      </Badge>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="font-semibold">{filteredExecutions.length} executions</span>
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
                <Badge variant="outline" className="h-10 px-4 font-bold">
                  {filteredExecutions.length} execution{filteredExecutions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-8">
              {filteredExecutions.length === 0 ? (
                <Card className="border-2 border-dashed border-border/50 h-full flex items-center justify-center">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <Activity className="h-16 w-16 text-muted-foreground/20 mb-4" />
                    <p className="text-lg font-bold text-muted-foreground">No executions found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchExecution ? `No matches for "${searchExecution}"` : 'No execution history available'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full">
                  <DataTable
                    rowData={paginatedExecutions}
                    colDefs={columnDefs}
                    isLoading={loadingExecutions}
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
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black">
                  Execution Log Details
                </DialogTitle>
                <DialogDescription className="flex items-center gap-3 mt-1">
                  <span className="font-semibold text-foreground">{selectedExecution?.hostName}</span>
                  <Separator orientation="vertical" className="h-4" />
                  {selectedExecution && (
                    <Badge className={`${getStatusColor(selectedExecution.status)} font-bold`}>
                      {getStatusIcon(selectedExecution.status)}
                      <span className="ml-1.5">{selectedExecution.status}</span>
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            {selectedExecution && (
              <div className="space-y-4">
                {/* Execution Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Timer className="h-4 w-4" />
                        <span className="font-bold">Started At</span>
                      </div>
                      <p className="text-base font-semibold">
                        {new Date(selectedExecution.startedAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-bold">Location</span>
                      </div>
                      <p className="text-base font-semibold">
                        {selectedExecution.location}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Log Output */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-3">
                    <Terminal className="h-4 w-4" />
                    Output Log
                  </div>
                  
                  <div className="relative rounded-xl border h-50 border-border/40 bg-slate-950 dark:bg-slate-950/80 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900/80 to-transparent flex items-center px-4 gap-1.5 z-10">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="ml-3 text-[10px] font-mono text-slate-400">output.log</span>
                    </div>
                    <ScrollArea className="h-96">
                      <pre className="p-4 pt-10 text-xs font-mono leading-relaxed text-emerald-400 whitespace-pre-wrap break-words">
                        {selectedExecution.stdout || '# No output available'}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScriptExecutionDrillReport;
import React, { useState, useMemo } from 'react';
import { Activity, CheckCircle2, XCircle, Clock, PlayCircle, Server, Zap, TrendingUp, AlertCircle, BarChart3, Timer, Laptop, Terminal, Monitor, Link2Off, Link, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import Breadcrumb from '@/components/common/breadcrumb';
import { useGetDashboardCounts, useGetDashboardCountsByTimeline, useGetDashboardRecentExecutionAll, useGetOverviewDashboardEndPoint, useGetSystemListCount, useGetTemplatesCounts } from './hooks';
import { cn } from '@/lib/utils';
import { FaDiagramSuccessor } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useGetScriptCount } from '../ScriptList/hooks';
import { Badge } from '@/components/ui/badge';


interface PlatformConfig {
  id: string;
  label: string;
  icon: React.ElementType; 
  color: string;
}
const ScriptDashboard = () => {
 const navigate = useNavigate();
 const [activePlatform, setActivePlatform] = useState<string>(
   "WINDOWS",
   );
  const {data:dashboardCount} = useGetDashboardCounts();
    const {data:templatesCount} = useGetTemplatesCounts();

  const stats = {
     success: dashboardCount?.success,
    failed: dashboardCount?.failed,
    pending: dashboardCount?.pending,
    total: dashboardCount?.total
  }
  

const {data:targetDistribution}=useGetSystemListCount(activePlatform);

  const { data: recentExecution = [] } = useGetDashboardRecentExecutionAll();
  

  const { data: scriptCount } = useGetScriptCount();
  
  
  const {data:dashboardEndPointData} = useGetOverviewDashboardEndPoint();
  
  const dashboardEndPoint = dashboardEndPointData?.cardCount||{};


  const {data:timelineCount} = useGetDashboardCountsByTimeline();
const timelineData = useMemo(() => {
  if (!timelineCount?.data?.slots) return [];

  return timelineCount.data.slots.map((slot: any) => {
    const from = new Date(slot.from);
    const to = new Date(slot.to);

    const format = (d: Date) =>
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return {
      time: `${format(from)} - ${format(to)}`,
      success: slot.success,
      failed: slot.failed,
      pending: slot.pending,
    };
  });
}, [timelineCount]);




const platforms: PlatformConfig[] = [
  { id: "WINDOWS", label: "Windows", icon: Server, color: "#3b82f6" },
  { id: "MAC", label: "macOS", icon: Laptop, color: "#a855f7" },
  { id: "LINUX", label: "Linux", icon: Terminal, color: "#f59e0b" },
];


  // const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : '0.0';

  const activePlatformData = platforms.find(p => p.id === activePlatform);

  const chartData = [
    { name: activePlatform, value: targetDistribution || 0 },
    { name: "Remaining", value: 0 } 
  ];










  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl border border-slate-700">
 <p className="text-sm font-semibold mb-2">
  Time Slot: {payload[0].payload.time}
</p>

          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-xs flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.stroke || item.fill }}></div>
                {item.name}:
              </span>
              <span className="font-bold text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen ">
           <div className="mb-4">
                  <Breadcrumb
                    items={[
                      {
                        label: "Module Dashboard",
                        path: "/app/dashboard",
                      },
                      {
                        label: "Script Dashboard",
                      },
                    ]}
                  />
                </div>
      <div className="p-2 mx-auto space-y-8">
        <div className="relative">
          <div className="absolute inset-0  rounded-full"></div>
          <div className="relative flex items-center justify-between  p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-xl opacity-50 rounded-2xl"></div>
                <div className="relative bg-primary p-4 rounded-2xl shadow-lg">
                  <Server className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold  mb-2">
                  Script Execution Monitor
                </h1>
                <p className="text-slate-400 text-lg">Real-time agent script performance dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-500/30 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-bold text-green-400">LIVE MONITORING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="group relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/30 to-cyan-500/30 blur-xl group-hover:blur-xl transition-all duration-300 rounded-3xl"></div>
            <Card className="relative  shadow-md hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 overflow-hidden" onClick={()=>navigate('/app/scriptRunner/scriptTemplate')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Templates</CardTitle>
                  <div className="bg-blue-500/20 p-2 rounded-xl">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black  mb-2">{templatesCount?.data||0}</div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  {/* <span>Last 24 hours</span> */}
                  <span>templates</span>
                </div>
              </CardContent>
            </Card>
          </div>

  <div className="group relative">
            <div className="absolute inset-0 bg-linear-to-r from-violet-500/30 to-violet-500/30 blur-xl group-hover:blur-xl transition-all duration-300 rounded-3xl"></div>
            <Card className="relative  shadow-md hover:shadow-violet-500/20 transition-all duration-300 hover:scale-105 overflow-hidden" onClick={()=>navigate('/app/scriptRunner/scriptCardList')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Scripts</CardTitle>
                  <div className="bg-red-500/20 p-2 rounded-xl">
                    <FaDiagramSuccessor className="w-5 h-5 text-violet-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black  mb-2">{scriptCount}</div>
                <div className="flex items-center gap-2 text-violet-400 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>Total script</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-linear-to-r from-green-500/30 to-emerald-500/30 blur-xl group-hover:blur-xl transition-all duration-300 rounded-3xl"></div>
            <Card className="relative shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 overflow-hidden" onClick={() => navigate('/app/scriptRunner/executionReportAll', { state: {scriptId:null,  status: 'success' } })}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Finished Script</CardTitle>
                  <div className="bg-green-500/20 p-2 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black  mb-2">{stats.success}</div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {/* <span>{successRate}% success rate</span> */}
                   <span>Finished script on system</span>
                </div>
              </CardContent>
            </Card>
          </div>

        
          <div className="group relative">
            <div className="absolute inset-0 bg-linear-to-r from-amber-500/30 to-orange-500/30 blur-xl group-hover:blur-xl transition-all duration-300 rounded-3xl"></div>
            <Card className="relative shadow-md hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105 overflow-hidden" onClick={() => navigate('/app/scriptRunner/executionReportAll', { state: {scriptId:null, status: 'failed' } })}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pending Script</CardTitle>
                  <div className="bg-amber-500/20 p-2 rounded-xl">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black  mb-2">{stats.pending}</div>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                  <Timer className="w-4 h-4" />
                  <span>Pending script on system</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>


<div className="group relative">
          <div className="absolute inset-0 bg-linear-to-r from-slate-100 to-slate-200 blur-2xl opacity-50 -z-10 rounded-3xl"></div>
          <Card className="border-2  shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 items-stretch">
              {/* Total Card */}
              <div 
                className="p-8 border-b lg:border-b-0 lg:border-r bg-muted hover:bg-primary/10 transition-colors cursor-pointer group"
                onClick={() => navigate('/app/scriptRunner/totalEndPoints')}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold  uppercase text-xs tracking-widest">Total Endpoints</h3>
                </div>
                <div className="text-5xl font-black mb-2">{dashboardEndPoint?.totalEndPoint}</div>
                <p className="text-xs text-slate-400 font-medium">Across all network clusters</p>
              </div>

              {/* Progress & Visual Section */}
              <div className="lg:col-span-2 p-8 flex flex-col justify-center gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm font-bold text-emerald-600 block">Health Check</span>
                    <span className="text-2xl font-black ">Operational Ratio</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold ">
                      {((dashboardEndPoint.activeEndPoint / dashboardEndPoint.totalEndPoint) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
                    style={{ width: `${(dashboardEndPoint.activeEndPoint / dashboardEndPoint.totalEndPoint) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-linear-to-r from-rose-400 to-rose-600 transition-all duration-1000"
                    style={{ width: `${(dashboardEndPoint.inactiveEndPoint / dashboardEndPoint.totalEndPoint) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => navigate('/app/scriptRunner/activeEndPoints')}
                  >
                    <Link className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-700 block uppercase">Active</span>
                      <span className="text-lg font-black text-emerald-900">{dashboardEndPoint.activeEndPoint}</span>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => navigate('/app/scriptRunner/inActiveEndPoints')}
                  >
                    <Link2Off className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="text-xs font-bold text-rose-700 block uppercase">Inactive</span>
                      <span className="text-lg font-black text-rose-900">{dashboardEndPoint.inactiveEndPoint}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="p-8 bg-slate-900 flex flex-col justify-center items-center text-center">
                 <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mb-4">
                    <Activity className="w-10 h-10 text-emerald-400 animate-pulse" />
                 </div>
                 <h4 className="text-white font-bold mb-1">System Pulse</h4>
                 <p className="text-slate-400 text-xs px-4">Endpoints are responding within normal latency parameters.</p>
              </div>
            </div>
          </Card>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area Chart */}
          <div className="lg:col-span-2 group relative">
            <div className="absolute inset-0  rounded-3xl"></div>
            <Card className="relative  backdrop-blur-xl border-2  shadow hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-linear-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                      <Zap className="w-6 h-6 " />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold ">Execution Timeline</CardTitle>
                      <CardDescription className="text-slate-400 text-sm mt-1">Performance trends over 24 hours</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} fontWeight={600} />
                    <YAxis stroke="#94a3b8" fontSize={12} fontWeight={600} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                      formatter={(value) => <span className=" font-medium">{value}</span>}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="success" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fill="url(#successGradient)"
                      name="Success"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="failed" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      fill="url(#failedGradient)"
                      name="Failed"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      fill="url(#pendingGradient)"
                      name="Pending"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Pie Chart */}
          <div className="group relative">
            <div className="absolute inset-0  rounded-3xl"></div>
            <Card className="relative overflow-hidden border shadow-sm flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <PlayCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Target Distribution</CardTitle>
            <CardDescription className="text-xs">System count by OS</CardDescription>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex p-1 bg-muted rounded-xl gap-1">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isActive = activePlatform === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-1 rounded-lg text-xs font-bold transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{platform.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center pt-6">
  
        <div className="relative h-50 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                startAngle={90}
                endAngle={450}
                dataKey="value"
              >
                <Cell fill={activePlatformData?.color || "#3b82f6"} stroke="none" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tighter text-foreground">
              {targetDistribution ?? 0}
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Total System
            </span>
          </div>
        </div>

        <div className="w-full mt-6">
          <div 
            className="flex items-center justify-between p-4 rounded-2xl border bg-accent/20 border-border/50 transition-all hover:bg-accent/30"
          >
            <div className="flex items-center gap-4">
              <div 
                className="p-2.5 rounded-xl shadow-inner text-white" 
                style={{ backgroundColor: activePlatformData?.color }}
              >
                {activePlatformData && <activePlatformData.icon size={20} />}
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">{activePlatformData?.label}</p>
                <p className="text-sm font-semibold">Total Systems</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-foreground">{targetDistribution ?? 0}</p>
              <div className="flex items-center gap-1 text-[10px] font-medium text-green-500">
                <Monitor size={10} />
                {/* <span>Online</span> */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
          </div>
        </div>


       <div className="group relative">
  <Card className="relative backdrop-blur-xl border-border/50 shadow-md rounded-lg overflow-hidden bg-card">
    <CardHeader className="pb-6 border-b border-border/40 bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Recent Executions</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5 font-medium">
              Real-time script performance and status
            </CardDescription>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
          Live Stream
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border/60">
              <th className="text-left py-4 px-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Script Details</th>
              <th className="text-left py-4 px-6 text-[11px] font-black uppercasetracking-widest text-muted-foreground">Execution Status</th>
              <th className="text-center py-4 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Duration</th>
              <th className="text-right py-4 px-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Time Window</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {recentExecution.map((execution: any) => {
              const startTime = new Date(execution.startedAt);
              const finishTime = new Date(execution.finishedAt);
              const duration = Math.round((finishTime.getTime() - startTime.getTime()) / 1000);

              return (
                <tr 
                  key={execution.id || execution.runUuid} 
                  className="hover:bg-primary/2  transition-colors duration-200 group/row"
                >
                 <td className="py-4 px-6">
  <div className="flex items-center gap-3 group/row">
        <div className="w-2.5 h-2.5 bg-primary rounded-full 
                    transition-transform group-hover/row:scale-125" />

    <div className="flex flex-col leading-tight">
      <span className="text-sm font-semibold text-foreground 
                       group-hover/row:text-primary transition-colors">
        {execution.scriptName}
      </span>

      <span className="text-xs font-mono text-muted-foreground">
        ID: {execution.systemSerialNumber}
      </span>
    </div>

  </div>
</td>


                  {/* Status Badge */}
                  <td className="py-5 px-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider border shadow-sm ${
                      execution.status === 'SUCCESS' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : execution.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {execution.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {execution.status === 'FAILED' && <XCircle className="w-3.5 h-3.5" />}
                      {(execution.status === 'PENDING' || execution.status === 'RUNNING') && <Clock className="w-3.5 h-3.5 animate-spin" />}
                      {execution.status.toUpperCase()}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-5 px-6 text-center">
                    <span className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md border border-border/50 text-foreground/80">
                      {duration}s
                    </span>
                  </td>

                  {/* Timestamps */}
                  <td className="py-5 px-8 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Start:</span>
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60">
                        <span className="text-[10px] uppercase font-bold">End:</span>
                        {finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</div>
      </div>
    </div>
  );
};

export default ScriptDashboard;

import { useState, useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Layers,
  Zap,
  TrendingUp,
  ChevronRight,
  Timer,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {  useGetAvgExecutionMetric, useGetDashboardCountsData, useGetDashboardRecentExecution, useGetScripts } from "./hooks";
import { ComboboxDropdown } from "@/components/common/ComboBox";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";





export default function ScriptOpsDashboard() {
 const [scriptId, setScriptId] = useState<any | null>('');
  const { data: dashboardCount } = useGetDashboardCountsData(scriptId);
    const { data: dashboardAvgExecutionMetric } = useGetAvgExecutionMetric(scriptId);
  
  const { data: scripts = [] } = useGetScripts();
  const { data: recentExecution = [] } = useGetDashboardRecentExecution(scriptId);
  
  const processedData = useMemo(() => {
    const hasRealData = dashboardCount ;

    if (hasRealData) {
      return {
        stats: {
          success: dashboardCount.success || 0,
          failed: dashboardCount.failed || 0,
          pending: dashboardCount.pending || 0,
          total: dashboardCount.total || 0,
        },
        chartTimeline: [
          { time: "09:00", success: Math.floor(dashboardCount.success * 0.4), failed: 2 },
          { time: "12:00", success: Math.floor(dashboardCount.success * 0.7), failed: 5 },
          { time: "15:00", success: dashboardCount.success, failed: dashboardCount.failed },
        ],
        isDemo: false
      };
    }

    // fallback DEMO DATA
    return {
      stats: { success: 84, failed: 12, pending: 4, total: 100 },
      chartTimeline: [
        { time: "08:00", success: 10, failed: 1 },
        { time: "12:00", success: 45, failed: 5 },
        { time: "16:00", success: 70, failed: 8 },
        { time: "20:00", success: 84, failed: 12 },
      ],
      isDemo: true
    };
  }, [dashboardCount]);

  const { stats, chartTimeline } = processedData;

  const completion = Math.min((stats.success / stats.total) * 100, 100) || 0;

  const pieData = [
    { name: "Success", value: stats.success, color: "#10b981" },
    { name: "Failed", value: stats.failed, color: "#ef4444" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
  ];

  const formatDateTime = (iso: string) => {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const navigate = useNavigate();

const handleKpiClick = (status: string) => {
  if (!scriptId) return;
  navigate("/scriptRunner/executionReport", { 
    state: { scriptId, status: status.toUpperCase() } 
  });
};
  return (
    <div className="min-h-screen  ">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary shadow-2xl shadow-primary/20">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-primary bg-clip-text text-transparent">
              Script Command Center
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time AI execution intelligence & analytics
            </p>
          </div>
        </div>

   

        <div className="min-w-80">
              <ComboboxDropdown
  value={scriptId}
  onChange={(val) => setScriptId(val)}
  placeholder="⚡ Select or type script engine"
  options={scripts.map((s: any) => ({
    value: s.id,
    label: s.name,
    description: s.description || "No description available",
  }))}
/>
        </div>
      

      </div>


      {!scriptId ? (
        <div className="h-125 flex flex-col justify-center items-center border-2 border-dashed ">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <Zap className="w-32 h-32 text-blue-400 relative z-10" />
          </div>
          <h2 className="text-3xl font-bold mt-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Select a Script Engine
          </h2>
          <p className="text-slate-400 mt-3 text-lg">
            Live AI insights and analytics will appear here
          </p>
        </div>
      ):(
        <>
          {/* KPI GRID */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <KPI
              title="Success"
              value={stats.success}
              icon={<CheckCircle2 />}
              gradient="from-emerald-500 to-green-600"
              shadow="shadow-emerald-500/20"
              onClick={() => handleKpiClick("Success")}
            />
            <KPI
              title="Failed"
              value={stats.failed}
              icon={<XCircle />}
              gradient="from-red-500 to-rose-600"
              shadow="shadow-red-500/20"
              onClick={() => handleKpiClick("Failed")}
            />
            <KPI
              title="Pending"
              value={stats.pending}
              icon={<Clock />}
              gradient="from-amber-500 to-orange-600"
              shadow="shadow-amber-500/20"
              onClick={() => handleKpiClick("Pending")}
            />
            <KPI
              title="Target"
              value={stats.total}
              icon={<Target />}
              gradient="from-purple-500 to-violet-600"
              shadow="shadow-purple-500/20"
              onClick={() => handleKpiClick("Total")}
            />
            {/* <KPI
              title="Uptime"
              value={data.uptime}
              icon={<TrendingUp />}
              gradient="from-teal-500 to-cyan-600"
              shadow="shadow-teal-500/20"
            /> */}
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            <MiniCard title="Average Execution Time" value={dashboardAvgExecutionMetric?.data?.averageExecutionTimeSeconds} gradient="from-blue-500/10 to-purple-500/10" />
            <MiniCard title="Last Execution" value={formatDateTime(dashboardAvgExecutionMetric?.data?.lastExecutionTime)} gradient="from-green-500/10 to-emerald-500/10" />
            <MiniCard
              title="Success Rate"
              value={`${dashboardAvgExecutionMetric?.data?.successRate} %`}
              gradient="from-orange-500/10 to-amber-500/10"
            />
          </div>

          {/* MAIN ANALYTICS */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Cumulative Progress */}
            <GlassCard
              title="Cumulative Progress"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartTimeline}>
                  <defs>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                     color: "var(--foreground)",    
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "0.875rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="success"
                    stroke="#10b981"
                    fill="url(#successGradient)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    stroke="#ef4444"
                    fill="url(#failedGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Status Distribution Pie */}
            <GlassCard
              title="Status Distribution"
              icon={<Activity className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--card)",
                     color: "var(--foreground)",    
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "0.875rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-slate-400">{entry.name}</span>
                    <span className="text-sm font-semibold text-white">{entry.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Target Progress */}
            <GlassCard
              title="Target Completion"
              icon={<Target className="w-5 h-5" />}
            >
              <div className="text-center mt-8">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#progressGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - completion / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute">
                    <p className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {completion.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className="mt-6 ">
                  <span className="text-2xl font-bold ">
                    {stats.success}
                  </span>
                  <span className=" mx-2">/</span>
                  <span className="text-xl ">{stats.total}</span>
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Scripts Executed Today
                </p>
              </div>
            </GlassCard>
          </div>

          {/* HOURLY ACTIVITY */}
          <div className="mb-8">
            {/* <GlassCard
              title="24-Hour Activity Pattern"
              icon={<Clock className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.hourly}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="hour"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                 <Tooltip
  contentStyle={{
    backgroundColor: "var(--card)", 
    color: "var(--foreground)",    
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "0.875rem",
  }}
  itemStyle={{
    color: "var(--foreground)",
    fontWeight: 500,
  }}
  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} 
/>

                  <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard> */}

          </div>

<GlassCard
  title="Execution Stream"
  icon={<Activity className="w-5 h-5" />}
>
  <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-muted before:via-border before:to-transparent">
    {recentExecution?.map((r: any) => {
      const startTime = new Date(r.startedAt);
      const finishTime = new Date(r.finishedAt);

      const duration = Math.round((finishTime.getTime() - startTime.getTime()) / 1000);

      return (
        <div key={r.runUuid} className="relative pl-10 group">
          <div className={`absolute left-0 w-10 flex justify-center`}>
            <div className={`w-3 h-3 rounded-full mt-1.5 border-4 border-background z-10 ${
              r.status === "SUCCESS" ? "bg-green-500 ring-4 ring-green-500/10" : 
              r.status === "FAILED" ? "bg-red-500 ring-4 ring-red-500/10" : 
              "bg-blue-500 animate-pulse"
            }`} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-muted border border-border/50 group-hover:border-primary/30 transition-all shadow-sm group-hover:shadow-md">
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{r.scriptName}</span>
                <Badge variant="outline" className="text-[10px] py-0 h-4 bg-muted/50">
                  ID: {r.scriptId}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium text-foreground/70">Start:</span> {startTime.toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-1 border-l pl-4 border-border">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="font-medium text-foreground/70">End:</span> {finishTime.toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-1 border-l pl-4 border-border">
                  <Timer className="w-3 h-3" />
                  <span>{duration}s duration</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Host</span>
                <span className="text-xs font-mono">{r.hostName}</span>
              </div>

              <div className={`px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-2 ${
                r.status === "SUCCESS" 
                ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                : "bg-red-500/10 text-red-600 border border-red-500/20"
              }`}>
                {r.status === "SUCCESS" ? <ChevronRight className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {r.status}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</GlassCard>
        </>
      )}
    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

interface KPIProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
  onClick:any;
}

function KPI({ title, value, icon, gradient, shadow ,onClick}: KPIProps) {
  return (
    <div className={`bg-card rounded-lg border-2 p-5 ${shadow} hover:scale-105 hover:shadow-2xl transition-all cursor-pointer`} onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <p className=" text-sm font-medium">{title}</p>
        <div className={`p-2 rounded-xl bg-linear-to-br ${gradient} shadow-lg`}>
          <div >{icon}</div>
        </div>
      </div>
      <p className="text-3xl font-bold ">{value}</p>
    </div>
  );
}

interface MiniCardProps {
  title: string;
  value: string;
  gradient: string;
}

function MiniCard({ title, value, gradient }: MiniCardProps) {
  return (
    <div className={`bg-linear-to-br ${gradient} backdrop-blur-xl  border rounded-xl p-4`}>
      <p className="text-foreground text-sm mb-2">{title}</p>
      <p className="text-2xl font-bold ">{value}</p>
    </div>
  );
}

interface GlassCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function GlassCard({ title, icon, children }: GlassCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-primary">{icon}</div>
        <p className="font-semibold text-lg ">{title}</p>
      </div>
      {children}
    </div>
  );
}
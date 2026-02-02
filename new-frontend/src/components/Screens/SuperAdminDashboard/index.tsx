






import { useState, useEffect } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Cpu,
  Zap,
  Bug,
  Activity,
  TrendingUp,
  Settings,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ListChecks,
  MonitorPlay,
  FileText,
  Users,
  BarChart3,
  ChevronRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/components/context/permission-context";

// Stats Data
const statsData = [
  { title: "Total Agents", value: 485, change: "+12%", icon: Cpu, trend: "up", color: "from-blue-500 to-cyan-500" },
  { title: "Active Scripts", value: 42, change: "+8%", icon: Zap, trend: "up", color: "from-violet-500 to-purple-500" },
  { title: "Config Issues", value: 8, change: "-3%", icon: Bug, trend: "down", color: "from-amber-500 to-orange-500" },
  { title: "System Uptime", value: "99.9%", change: "+0.2%", icon: Activity, trend: "up", color: "from-emerald-500 to-green-500" },
];

// Chart Data
const activityData = [
  { time: "08:00", active: 150, offline: 35 },
  { time: "10:00", active: 262, offline: 23 },
  { time: "12:00", active: 370, offline: 15 },
  { time: "14:00", active: 465, offline: 20 },
  { time: "16:00", active: 375, offline: 10 },
  { time: "18:00", active: 580, offline: 5 },
];



// Recent Activity
const recentActivity = [
  { id: 1, type: "success", message: "Agent AG-485 deployed successfully", time: "2 min ago" },
  { id: 2, type: "warning", message: "Script timeout on AG-302", time: "5 min ago" },
  { id: 3, type: "info", message: "Configuration updated for AG-156", time: "12 min ago" },
  { id: 4, type: "success", message: "Compliance check passed", time: "18 min ago" },
  { id: 5, type: "info", message: "Database backup completed", time: "25 min ago" },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-cyan-500",
  violet: "from-violet-500 to-purple-500",
  cyan: "from-cyan-500 to-teal-500",
  amber: "from-amber-500 to-orange-500",
  emerald: "from-emerald-500 to-green-500",
  pink: "from-pink-500 to-rose-500",
  red: "from-red-500 to-rose-500",
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card/95 backdrop-blur-lg p-4 shadow-2xl">
        <p className="text-sm font-bold mb-3 text-foreground">{payload[0].payload.time}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shadow-lg"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-bold text-sm text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};




const moduleIconMap: Record<string, React.ElementType> = {
  "Agent Configuration": Settings,
  "Agent Installation": ListChecks,
  "Script Runner": MonitorPlay,
  "Access Control": FileText,
  "User Management": Users,
  "Reports": BarChart3,
  "Security Center": Shield,
};

const moduleColorMap: Record<string, keyof typeof colorMap> = {
  "Agent Configuration": "blue",
  "Agent Installation": "violet",
  "Script Runner": "cyan",
  "Access Control": "amber",
  "User Management": "emerald",
  "Reports": "pink",
  "Security Center": "red",
};


export default function PremiumDashboard() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const timer1 = setInterval(() => setCount1((c) => (c < 485 ? c + 15 : 485)), 30);
    const timer2 = setInterval(() => setCount2((c) => (c < 42 ? c + 1 : 42)), 50);
    const timer3 = setInterval(() => setCount3((c) => (c < 8 ? c + 1 : 8)), 100);
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, []);

  const router = useNavigate();
  
 const { routes } = usePermissions();

  const buildQuickAccessFromPermissions = (routes: any) => {
  if (!routes?.modules) return [];

  return Object.entries(routes.modules).map(
    ([moduleName, categories]: any) => {
      // find first permission with navigationUrl
      let firstRoute = "";

      Object.values(categories).some((permissions: any) =>
        permissions.some((perm: any) => {
          if (perm.navigationUrl) {
            firstRoute = perm.navigationUrl;
            return true;
          }
          return false;
        })
      );

      return {
        name: moduleName,
        route: firstRoute,
        description: `Access ${moduleName}`,
        icon: moduleIconMap[moduleName] ?? Shield, 
        color: moduleColorMap[moduleName] ?? "blue",
      };
    }
  );
};

 const [quickModules, setQuickModules] = useState<any[]>([]);

useEffect(() => {
  if (routes) {
    const modules = buildQuickAccessFromPermissions(routes);
    setQuickModules(modules);
  }
}, [routes]);


const handleModuleNavigation = (module: any) => {
  router(module.route, {
    state: {
      moduleName: module.name,
      moduleData: routes.modules[module.name],
    },
  });
};


  return (
    <div  id="dashboard" className="min-h-screen bg-background">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-linear-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-linear-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8   ">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-linear-to-br from-blue-500 to-violet-500 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black">
                  <span className="bg-linear-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-primary">
                    Zioset
                  </span>{" "}
                  <span className="text-foreground">Management Console</span>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Real-time oversight of all deployed agents and system operations
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* <Button variant="outline" className="shadow-lg hover:shadow-xl transition-all border-border/50 backdrop-blur-sm">
                <Activity className="w-4 h-4 mr-2" /> View Logs
              </Button> */}
              {/* <Button className="shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-all">
                <Download className="w-4 h-4 mr-2" /> Export Data
              </Button> */}
            </div>
          </div>
        </div>

          {/* Quick Access Modules */}
        <Card   id="quick-modules" className="shadow-sm border-border/50 mb-8 backdrop-blur-sm bg-card/80">
          <CardHeader className="border-b border-border/50 bg-linear-to-r from-card to-muted/30">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 rounded-xl bg-linear-to-br from-blue-500 to-violet-500">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              Quick Access Modules
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {quickModules.map((module) => (
                
                <button
                     key={module.name}
          onClick={() => handleModuleNavigation(module)}
                  className="relative flex flex-col items-start gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:bg-accent/50 
                           hover:border-primary/50 transition-all duration-300 text-left group shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-linear-to-br ${colorMap[module.color]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative flex items-start justify-between w-full">
                  <div
  className={`p-3 rounded-xl bg-linear-to-br ${colorMap[module.color]} shadow-lg 
              group-hover:scale-110 transition-transform duration-300`}
>
  <module.icon className="w-6 h-6 text-white" />
</div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="relative">
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{module.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, idx) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/80 group hover:scale-[1.02]"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardContent className="pt-6 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-linear-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs flex items-center gap-1 font-bold px-3 py-1 ${
                      stat.trend === "up" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {stat.title}
                </p>
                <p className="text-4xl font-black bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {idx === 0 ? count1 : idx === 1 ? count2 : idx === 2 ? count3 : stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
          <Card className="xl:col-span-2 shadow-sm border-border/50 backdrop-blur-xl bg-card/80">
            <CardHeader className="border-b border-border/50 bg-linear-to-r from-card to-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500 to-green-500">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Agent Activity Overview
                </CardTitle>
                <Badge variant="secondary" className="font-semibold">Live Data</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="offlineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    fontWeight={600}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    fontWeight={600}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fill="url(#activeGradient)" 
                    name="Active Agents"
                    animationDuration={1000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="offline" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    fill="url(#offlineGradient)" 
                    name="Offline Agents"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-8">
         {/* Recent Activity */}
            <Card className="shadow-sm border-border/50 backdrop-blur-xl bg-card/80">
              <CardHeader className="border-b border-border/50 bg-linear-to-r from-card to-muted/30">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-2 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-3 max-h-100 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-border/30 hover:border-border/60 hover:shadow-lg group"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === "success" ? "bg-emerald-500/10" :
                      activity.type === "warning" ? "bg-amber-500/10" : "bg-blue-500/10"
                    } group-hover:scale-110 transition-transform`}>
                      {activity.type === "success" && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {activity.type === "warning" && (
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      )}
                      {activity.type === "info" && (
                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
    </div>
  );
}
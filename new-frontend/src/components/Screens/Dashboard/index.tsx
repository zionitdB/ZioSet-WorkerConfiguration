// import  { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ChevronRight,
//   Cpu,
//   Zap,
//   Activity,
//   MonitorPlay,
//   Search,
//   BarChart2,
//   List,
//   LucideIcon,
// } from "lucide-react"; // Added more icons for professional look
// import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
// import { useNavigate } from "react-router-dom";

// // --- Data Definitions (Keeping your existing data) ---
// interface Stat {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   trend: string;
//   change: string;
// }

// interface ActivityData {
//   time: string;
//   active: number;
//   offline: number;
// }

// interface Agent {
//   id: number;
//   name: string;
//   status: 'Active' | 'Offline';
//   os: string;
//   region: string;
//   version: string;
//   ip: string;
//   lastSeen: string;
// }

// // Ensure proper typing for data arrays
// const statsData: Stat[] = [
//   { title: "Total Agents", value: 485, icon: Cpu, trend: "up", change: "+12%" },
//   { title: "Active Scripts", value: 42, icon: Zap, trend: "up", change: "+8%" },
//   { title: "System Uptime", value: "99.9%", icon: Activity, trend: "up", change: "+0.2%" },
// ];

// const activityData: ActivityData[] = [
//   { time: "08:00", active: 450, offline: 35 },
//   { time: "10:00", active: 462, offline: 23 },
//   { time: "12:00", active: 470, offline: 15 },
//   { time: "14:00", active: 465, offline: 20 },
//   { time: "16:00", active: 475, offline: 10 },
//   { time: "18:00", active: 480, offline: 5 },
// ];

// const agents: Agent[] = [
//   { id: 1, name: "AG-485", status: "Active", os: "Windows", region: "US-East", version: "v1.2.3", ip: "192.168.1.5", lastSeen: "2 min ago" },
//   { id: 2, name: "AG-302", status: "Offline", os: "Linux", region: "EU-West", version: "v1.1.0", ip: "192.168.2.7", lastSeen: "5 min ago" },
//   { id: 3, name: "AG-156", status: "Active", os: "macOS", region: "AP-South", version: "v1.2.1", ip: "192.168.3.9", lastSeen: "12 min ago" },
//   { id: 4, name: "AG-200", status: "Active", os: "Linux", region: "US-West", version: "v1.3.0", ip: "192.168.4.3", lastSeen: "1 min ago" },
//   { id: 5, name: "AG-101", status: "Active", os: "Windows", region: "US-East", version: "v1.2.3", ip: "192.168.5.1", lastSeen: "30 sec ago" },
//   { id: 6, name: "AG-050", status: "Offline", os: "macOS", region: "EU-West", version: "v1.3.1", ip: "192.168.6.2", lastSeen: "1 hour ago" },
// ];

// // --- Custom Components ---

// // Recharts Tooltip for professional chart look
// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-md bg-card border shadow-lg p-3 text-sm">
//         <p className="font-bold text-foreground mb-1">{payload[0].payload.time}</p>
//         {payload.map((entry: any, idx: number) => (
//           <div key={idx} className="flex items-center gap-2 text-muted-foreground">
//             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
//             {entry.name}: <span className="font-semibold text-foreground">{entry.value}</span>
//           </div>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// // --- Main Dashboard Component ---

// export default function AgentDashboard() {
//   const [count1, setCount1] = useState(0);
//   const [count2, setCount2] = useState(0);
//   const [count3, setCount3] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   // Animation effect for stats
//   useEffect(() => {
//     const timer1 = setInterval(() => setCount1((c) => (c < 485 ? c + 10 : 485)), 30);
//     const timer2 = setInterval(() => setCount2((c) => (c < 42 ? c + 1 : 42)), 50);
//     const timer3 = setInterval(() => setCount3((c) => (c < 99 ? c + 1 : 99)), 40);
//     return () => {
//       clearInterval(timer1);
//       clearInterval(timer2);
//       clearInterval(timer3);
//     };
//   }, []);

//   const filteredAgents = agents.filter((a) => 
//     Object.values(a).some(val => 
//       String(val).toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   return (
//     <div className="min-h-screen bg-background p-4 space-y-6">
      
//       {/* --- Section 1: Header and Primary Action Bar (Clean and Functional) --- */}
//       <div className="pb-4 border-b border-border flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             <span className="text-primary">Agent</span>  Management
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Centralized monitoring and remote agent control interface.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" className="text-sm" onClick={() => navigate("/scripts/run")}>
//             <MonitorPlay className="w-4 h-4 mr-2" /> Run Script
//           </Button>
//           {/* <Button onClick={() => alert("Add Agent")} className="text-sm">
//             <PlusCircle className="w-4 h-4 mr-2" /> Add Agent
//           </Button> */}
//         </div>
//       </div>

//       {/* --- Section 2: Key Metrics (Clean Cards with Distinct Icons) --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {statsData.map((stat, idx) => (
//           <Card key={stat.title} className="hover:border-primary transition-colors duration-200">
//             <CardContent className="pt-6">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground uppercase">{stat.title}</p>
//                   <p className="text-4xl font-extrabold text-foreground">
//                     {idx === 0 ? count1 : idx === 1 ? count2 : count3}
//                     {stat.title === "System Uptime" ? (
//                       <span className="text-xl font-semibold">%</span>
//                     ) : null}
//                   </p>
//                 </div>
//                 <div className="flex flex-col items-end gap-1">
//                   <div className="p-2 rounded-full bg-primary/10">
//                     <stat.icon className="w-5 h-5 text-primary" />
//                   </div>
//                   <Badge variant="secondary" className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
//                     {stat.change}
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* --- Section 3: Main Content - Two-Column Panel Layout --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
//         {/* === Left Panel: Agent List/Table (9/12 width) === */}
//         <div className="lg:col-span-8">
//           <Card className="h-full flex flex-col">
//             <CardHeader className="p-4 border-b border-border flex flex-row justify-between items-center">
//                 <CardTitle className="text-lg font-semibold flex items-center">
//                     <List className="w-5 h-5 mr-2 text-primary" /> Agent Directory
//                 </CardTitle>
//                 <div className="relative flex items-center w-full max-w-sm">
//                     <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
//                     <Input
//                         placeholder="Search by name, OS, IP..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="pl-10 text-sm h-9"
//                     />
//                 </div>
//             </CardHeader>
//             <CardContent className="p-0 overflow-hidden flex-1">
//               <div className="overflow-x-auto h-full">
//                 <table className="min-w-full text-left table-fixed">
//                   <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
//                     <tr>
//                       <th className="w-1/12 px-4 py-3 text-sm font-semibold text-muted-foreground">ID</th>
//                       <th className="w-2/12 px-4 py-3 text-sm font-semibold text-muted-foreground">Agent Name</th>
//                       <th className="w-2/12 px-4 py-3 text-sm font-semibold text-muted-foreground">Status</th>
//                       <th className="w-2/12 px-4 py-3 text-sm font-semibold text-muted-foreground">OS / Region</th>
//                       <th className="w-2/12 px-4 py-3 text-sm font-semibold text-muted-foreground">IP Address</th>
//                       <th className="w-1/12 px-4 py-3 text-sm font-semibold text-muted-foreground">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredAgents.map((agent) => (
//                       <tr key={agent.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
//                         <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{agent.id}</td>
//                         <td className="px-4 py-3 text-sm font-medium text-foreground">{agent.name}</td>
//                         <td className="px-4 py-3">
//                           <Badge variant={agent.status === "Active" ? "default" : "secondary"} className={`
//                               ${agent.status === "Active" ? "bg-green-500 hover:bg-green-600" : "bg-destructive/80 hover:bg-destructive"}
//                               text-white font-medium
//                           `}>
//                             {agent.status}
//                           </Badge>
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                             <TooltipProvider>
//                                 <Tooltip>
//                                     <TooltipTrigger>
//                                         <span className="font-medium text-foreground">{agent.os}</span>
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                         <p>Region: {agent.region} | Version: {agent.version}</p>
//                                     </TooltipContent>
//                                 </Tooltip>
//                             </TooltipProvider>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-muted-foreground">{agent.ip}</td>
//                         <td className="px-4 py-3">
//                           <Button size="icon" variant="ghost" onClick={() => navigate(`/agents/${agent.id}`)}>
//                             <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-primary" />
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                     {filteredAgents.length === 0 && (
//                         <tr>
//                              <td colSpan={6} className="text-center py-8 text-muted-foreground">
//                                 No agents match your search criteria.
//                             </td>
//                         </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* === Right Panel: Activity Chart (3/12 width) === */}
//         <div className="lg:col-span-4">
//           <Card className="h-full flex flex-col">
//             <CardHeader className="p-4 border-b border-border">
//               <CardTitle className="text-lg font-semibold flex items-center">
//                 <BarChart2 className="w-5 h-5 mr-2 text-primary" /> Agent Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-4 flex-1">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     {/* Use Shadcn primary color */}
//                     <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
//                       <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
//                     </linearGradient>
//                     {/* Use destructive color (or a distinct red) */}
//                     <linearGradient id="offlineGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.5} />
//                       <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.7} />
//                   <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
//                   <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
//                   <RechartsTooltip content={<CustomTooltip />} />
//                   <Area type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#activeGradient)" name="Active" />
//                   <Area type="monotone" dataKey="offline" stroke="hsl(var(--destructive))" strokeWidth={2} fill="url(#offlineGradient)" name="Offline" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }



// import  { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Cpu, Activity, HardDrive, 
//   ShieldCheck, History, Laptop, Terminal, Layers,
//   PlusCircle
// } from "lucide-react";
// import { 
//   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
//   Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell 
// } from "recharts";
// import { Button } from "@/components/ui/button";

// // --- Custom Styled Components ---

// const StatusRing = ({ percent, color, label }: { percent: number, color: string, label: string }) => (
//   <div className="relative flex flex-col items-center justify-center group">
//     <svg className="w-32 h-32 transform -rotate-90">
//       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/10" />
//       <circle
//         cx="64"
//         cy="64"
//         r="58"
//         stroke={color}
//         strokeWidth="8"
//         fill="transparent"
//         strokeDasharray={364.4}
//         strokeDashoffset={364.4 - (364.4 * percent) / 100}
//         strokeLinecap="round"
//         className="transition-all duration-1000 ease-out"
//       />
//     </svg>
//     <div className="absolute inset-0 flex flex-col items-center justify-center">
//       <span className="text-2xl font-bold tracking-tighter">{percent}%</span>
//       <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
//     </div>
//   </div>
// );

// export default function PremiumAgentDashboard() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   const osData = [
//     { name: 'Windows', value: 240, color: '#0078d4' },
//     { name: 'MacOS', value: 120, color: '#ffbd2e' },
//     { name: 'Linux', value: 125, color: '#22c55e' },
//   ];

//   const liveMetrics = Array.from({ length: 20 }, (_, i) => ({
//     time: i,
//     usage: Math.floor(Math.random() * 40) + 30
//   }));

//   if (!mounted) return null;

//   return (
//     <div className="min-h-screen  p-6 font-sans">
      
//       <div className="pb-4 border-b border-border flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             <span className="text-primary">Agent</span>  Management
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Centralized monitoring and remote agent control interface.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           {/* <Button variant="outline" className="text-sm" onClick={() => console.log("/scripts/run")}>
//             <MonitorPlay className="w-4 h-4 mr-2" /> Run Script
//           </Button> */}
//           <Button onClick={() => alert("Add Agent")} className="text-sm">
//             <PlusCircle className="w-4 h-4 mr-2" /> Add Agent
//           </Button>
//         </div>
//       </div>
//       {/* --- TOP HUD: Overview Stats --- */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5 mb-8">
//         <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4 ">
//          <div className="shadow-md bg-card border p-6 rounded-3xl backdrop-blur-xl "> <StatusRing percent={92} color="#22c55e" label="Overall Health" /></div>
//           <div className="shadow-md bg-card border p-6 rounded-3xl backdrop-blur-xl"><StatusRing percent={88} color="#3b82f6" label="Performance" /></div>
//            <div className="shadow-md bg-card border p-6 rounded-3xl backdrop-blur-xl"><StatusRing percent={75} color="#f59e0b" label="Memory Load" /></div>
          
          
//         </div>
        
//         <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 border-none rounded-3xl overflow-hidden relative">
//           <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
//           <CardContent className="pt-8 flex flex-col items-center justify-center h-full text-white">
//             <ShieldCheck className="w-12 h-12 mb-2 opacity-80" />
//             <h3 className="text-lg font-medium opacity-90">System Status</h3>
//             <p className="text-4xl font-black">ACTIVE</p>
//             {/* <Badge className="mt-4 bg-white/20 hover:bg-white/30 border-none">v4.2.0-Stable</Badge> */}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
//         {/* --- LEFT COLUMN: OS & Inventory --- */}
//         <div className="lg:col-span-4 space-y-8">
//           <Card className=" rounded-3xl">
//             <CardHeader>
//               <CardTitle className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
//                 <Laptop className="w-4 h-4 text-blue-400" /> OS Distribution
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-48 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie data={osData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
//                       {osData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <RechartsTooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="grid grid-cols-3 gap-2 mt-4">
//                 {osData.map((os) => (
//                   <div key={os.name} className="text-center p-2 rounded-xl bg-muted">
//                     <p className="text-[10px] text-muted-foreground uppercase">{os.name}</p>
//                     <p className="font-bold" style={{ color: os.color }}>{os.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Vertical Timeline Activity */}
//           <Card className="rounded-3xl">
//             <CardHeader>
//               <CardTitle className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
//                 <History className="w-4 h-4 text-purple-400" /> Activity History
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {[
//                 { event: 'BIOS Updated', time: '12m ago', desc: 'Version 1.15.0 stable', color: 'bg-blue-500' },
//                 { event: 'RAM Upgraded', time: '2h ago', desc: '8GB -> 16GB Detected', color: 'bg-green-500' },
//                 { event: 'Security Alert', time: '5h ago', desc: 'Unauthorized login attempt', color: 'bg-red-500' },
//               ].map((item, i) => (
//                 <div key={i} className="flex gap-4 relative">
//                   <div className={`w-2 h-2 rounded-full mt-2 z-10 ${item.color}`} />
//                   {i !== 2 && <div className="absolute left-[3.5px] top-4 w-[1px] h-12 bg-muted" />}
//                   <div>
//                     <p className="text-sm font-bold">{item.event}</p>
//                     <p className="text-xs text-muted-foreground">{item.desc}</p>
//                     <span className="text-[10px] text-zinc-500 font-mono">{item.time}</span>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>

//         {/* --- RIGHT COLUMN: Live Monitor & Hardware --- */}
//         <div className="lg:col-span-8 space-y-8">
//           <Card className=" rounded-3xl overflow-hidden">
//             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-muted">
//               <div className="flex gap-4">
//                 <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400"><Cpu /></div>
//                 <div>
//                   <h4 className="font-bold">Intel Core i7-11800H</h4>
//                   <p className="text-xs text-muted-foreground">8 Cores | 16 Threads | 3.20 GHz</p>
//                 </div>
//               </div>
//               <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono">LIVE_STREAM</Badge>
//             </div>
//             <CardContent className="p-0">
//               <div className="h-64 w-full pt-6">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={liveMetrics}>
//                     <defs>
//                       <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
//                     <XAxis dataKey="time" hide />
//                     <YAxis hide domain={[0, 100]} />
//                     <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
//                     <Area 
//                       type="monotone" 
//                       dataKey="usage" 
//                       stroke="#3b82f6" 
//                       strokeWidth={3}
//                       fillOpacity={1} 
//                       fill="url(#colorUsage)" 
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Action Grid */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: 'Terminal', icon: Terminal, color: 'text-emerald-400' },
//               { label: 'Network', icon: Activity, color: 'text-sky-400' },
//               { label: 'Storage', icon: HardDrive, color: 'text-amber-400' },
//               { label: 'Processes', icon: Layers, color: 'text-rose-400' },
//             ].map((btn) => (
//               <button key={btn.label} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-muted border hover:bg-white/5 hover:border  transition-all group">
//                 <btn.icon className={`w-6 h-6 mb-2 ${btn.color} group-hover:scale-110 transition-transform`} />
//                 <span className="text-xs font-semibold uppercase tracking-widest">{btn.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, Activity, HardDrive, 
  ShieldCheck, History, Laptop, Terminal, Layers,
  PlusCircle, Wifi, WifiOff, TrendingUp, Zap, Server, 
  Clock, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/common/breadcrumb";

const StatusRing = ({ percent, color, label, icon: Icon }: { percent: number, color: string, label: string, icon?: any }) => (
  <div className="relative flex flex-col items-center justify-center group">
    <svg className="w-36 h-36 transform -rotate-90">
      <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted/10" />
      <circle
        cx="72"
        cy="72"
        r="62"
        stroke={color}
        strokeWidth="10"
        fill="transparent"
        strokeDasharray={389.6}
        strokeDashoffset={389.6 - (389.6 * percent) / 100}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out drop-shadow-lg"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {Icon && <Icon className="w-5 h-5 mb-1 text-muted-foreground" />}
      <span className="text-3xl font-black tracking-tighter">{percent}%</span>
      <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">{label}</span>
    </div>
  </div>
);

const AgentStatCard = ({ count, label, icon: Icon, trend, color }: any) => {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCount(c => (c < count ? c + Math.ceil(count / 20) : count));
    }, 50);
    return () => clearInterval(timer);
  }, [count]);

  return (
  <Card className={`relative overflow-hidden border-border/50  hover:shadow-2xl transition-all duration-300  bg-card/80 group hover:scale-[1.02]`}>
      <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <CardContent className="pt-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-2xl bg-linear-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          {trend && (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-black bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {animatedCount}
        </p>
      </CardContent>
    </Card>
  );
};

export default function PremiumAgentDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Agent Statistics
  const totalAgents = 485;
  const onlineAgents = 462;
  const offlineAgents = 23;
  const criticalAgents = 8;

  const osData = [
    { name: 'Windows', value: 240, color: '#0078d4' },
    { name: 'MacOS', value: 120, color: '#ffbd2e' },
    { name: 'Linux', value: 125, color: '#22c55e' },
  ];

  const agentActivityData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    online: Math.floor(Math.random() * 50) + 420,
    offline: Math.floor(Math.random() * 30) + 10,
  }));

  const liveMetrics = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    cpu: Math.floor(Math.random() * 40) + 30,
    memory: Math.floor(Math.random() * 35) + 45,
  }));

  const recentEvents = [
    { event: 'New Agent Deployed', time: '2m ago', desc: 'AG-485 successfully connected', color: 'bg-emerald-500', icon: CheckCircle2 },
    { event: 'Configuration Updated', time: '15m ago', desc: 'Security policy applied to 42 agents', color: 'bg-blue-500', icon: ShieldCheck },
    { event: 'Agent Disconnected', time: '28m ago', desc: 'AG-302 went offline', color: 'bg-amber-500', icon: AlertTriangle },
    { event: 'Critical Alert', time: '1h ago', desc: 'High CPU usage detected on AG-156', color: 'bg-red-500', icon: XCircle },
    { event: 'Backup Completed', time: '2h ago', desc: 'System backup successful', color: 'bg-violet-500', icon: CheckCircle2 },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screenp-6 font-sans">
      <div className="mb-6">
  <Breadcrumb
    items={[
      {
        label: "Module Dashboard",
        path: "/dashboard",
      },
      {
        label: "Agent Dashboard",
        path: "/agentManagement/dashboard",
      },
    ]}
  />
</div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-linear-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-linear-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 backdrop-blur-xl bg-card/50 rounded-2xl border border-border/50 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 shadow-lg">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black">
                  <span className="bg-linear-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-primary">
                    Agent
                  </span>{" "}
                  <span className="text-foreground">Management</span>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Centralized monitoring and remote agent control interface
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* <Button variant="outline" className="shadow-lg hover:shadow-xl transition-all border-border/50 backdrop-blur-sm">
                <Activity className="w-4 h-4 mr-2" /> Monitor All
              </Button> */}
              <Button onClick={() => alert("Add Agent")} >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Agent
              </Button>
            </div>
          </div>
        </div>

        {/* Agent Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AgentStatCard 
            count={totalAgents} 
            label="Total Agents" 
            icon={Server} 
            trend="+12%" 
            color="from-blue-500 to-cyan-500"
          />
          <AgentStatCard 
            count={onlineAgents} 
            label="Online Agents" 
            icon={Wifi} 
            trend="+8%" 
            color="from-emerald-500 to-green-500"
          />
          <AgentStatCard 
            count={offlineAgents} 
            label="Offline Agents" 
            icon={WifiOff} 
            color="from-amber-500 to-orange-500"
          />
          <AgentStatCard 
            count={criticalAgents} 
            label="Critical Issues" 
            icon={AlertTriangle} 
            color="from-red-500 to-rose-500"
          />
        </div>

        {/* Health Rings + System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className=" bg-card/80 border-border/50 p-6 rounded-3xl backdrop-blur-xl flex items-center justify-center">
              <StatusRing percent={95} color="#22c55e" label="System Health" icon={ShieldCheck} />
            </Card>
            <Card className=" bg-card/80 border-border/50 p-6 rounded-3xl backdrop-blur-xl flex items-center justify-center">
              <StatusRing percent={88} color="#3b82f6" label="Performance" icon={Zap} />
            </Card>
            <Card className=" bg-card/80 border-border/50 p-6 rounded-3xl backdrop-blur-xl flex items-center justify-center">
              <StatusRing percent={72} color="#f59e0b" label="Resource Load" icon={Activity} />
            </Card>
          </div>
          
          <Card className="bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 border-none rounded-3xl overflow-hidden relative ">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center h-full text-white relative z-10">
              <div className="p-4 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-sm font-bold opacity-90 uppercase tracking-wider mb-2">System Status</h3>
              <p className="text-4xl font-black mb-4">ACTIVE</p>
              <Badge className="bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                Uptime: 99.9%
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="xl:col-span-4 space-y-8">
            {/* OS Distribution */}
            <Card className=" border-border/50 backdrop-blur-xl bg-card/80 rounded-3xl">
              <CardHeader className="border-b border-border/50 bg-linear-to-r from-card to-muted/30">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500">
                    <Laptop className="w-4 h-4 text-white" />
                  </div>
                  OS Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={osData} 
                        innerRadius={70} 
                        outerRadius={95} 
                        paddingAngle={5} 
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {osData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '12px',
                          padding: '12px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {osData.map((os) => (
                    <div key={os.name} className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: os.color }} />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{os.name}</p>
                      <p className="font-black text-lg" style={{ color: os.color }}>{os.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card className="border-border/50 backdrop-blur-xl bg-card/80 rounded-3xl">
              <CardHeader className="border-b border-border/50 bg-linear-to-r from-card to-muted/30">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-500">
                    <History className="w-4 h-4 text-white" />
                  </div>
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 max-h-100 overflow-y-auto">
                {recentEvents.map((item, i) => (
                  <div key={i} className="flex gap-4 relative group">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" style={{ color: item.color.replace('bg-', '').replace('-500', '') }} />
                      </div>
                      {i !== recentEvents.length - 1 && (
                        <div className="absolute left-5 top-12 w-0.5 h-12 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-bold mb-1">{item.event}</p>
                      <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-1 rounded">{item.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-8 space-y-8">
            {/* Agent Activity Chart */}
            <Card className="border-border/50 backdrop-blur-xl bg-card/80 rounded-3xl">
              <CardHeader className="border-b border-border/50 bg-linear-to-r from-card to-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold uppercase tracking-wider flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500 to-green-500">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Agent Activity (24h)
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                    Live Monitoring
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={agentActivityData}>
                    <defs>
                      <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="offlineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '12px',
                        padding: '12px',
                        backdropFilter: 'blur(12px)'
                      }} 
                    />
                    <Area type="monotone" dataKey="online" stroke="#10b981" strokeWidth={3} fill="url(#onlineGradient)" name="Online" animationDuration={1000} />
                    <Area type="monotone" dataKey="offline" stroke="#ef4444" strokeWidth={3} fill="url(#offlineGradient)" name="Offline" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Live System Metrics */}
            <Card className=" border-border/50 backdrop-blur-xl bg-card/80 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-linear-to-r from-card to-muted/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-4">
                    <div className="p-3 bg-linear-to-br from-blue-500 to-violet-500 rounded-2xl shadow-lg">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">System Resource Monitor</h4>
                      <p className="text-xs text-muted-foreground">Real-time CPU & Memory tracking</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                    LIVE_STREAM
                  </Badge>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="h-72 w-full pt-6 px-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={liveMetrics}>
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '12px',
                          backdropFilter: 'blur(12px)'
                        }} 
                      />
                      <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} dot={false} name="CPU %" animationDuration={1000} />
                      <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Memory %" animationDuration={1000} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Terminal', icon: Terminal, color: 'from-emerald-500 to-green-500' },
                { label: 'Network', icon: Activity, color: 'from-sky-500 to-blue-500' },
                { label: 'Storage', icon: HardDrive, color: 'from-amber-500 to-orange-500' },
                { label: 'Processes', icon: Layers, color: 'from-rose-500 to-pink-500' },
              ].map((btn) => (
                <button 
                  key={btn.label} 
                  className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-card/80 border border-border/50 hover:border-border transition-all group shadow-lg hover:shadow-2xl backdrop-blur-xl hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${btn.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                  <div className={`p-3 rounded-xl bg-linear-to-br ${btn.color} mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <btn.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider relative">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
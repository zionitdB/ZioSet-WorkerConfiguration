import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, Users, Key, Fingerprint, 
  UserPlus, ShieldAlert, MoreHorizontal,
    Shield
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell,

} from "recharts";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/common/breadcrumb";

const AccessStatusRing = ({ percent, color, label }: any) => (
  <div className="relative flex flex-col items-center justify-center">
    <svg className="w-32 h-32 transform -rotate-90">
      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/10" />
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke={color}
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={351.8}
        strokeDashoffset={351.8 - (351.8 * percent) / 100}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-in-out"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span className="text-2xl font-black tracking-tighter">{percent}%</span>
      <span className="text-[10px] uppercase text-muted-foreground font-bold leading-tight px-4">{label}</span>
    </div>
  </div>
);

export default function AccessControlDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const roleDistribution = [
    { name: 'Admin', value: 12, color: '#6366f1' },
    { name: 'Editor', value: 45, color: '#3b82f6' },
    { name: 'Viewer', value: 240, color: '#10b981' },
    { name: 'Guest', value: 85, color: '#94a3b8' },
  ];

  const accessTrends = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}h`,
    granted: Math.floor(Math.random() * 500) + 1000,
    denied: Math.floor(Math.random() * 50),
  }));

  const recentAccessLogs = [
    { user: "admin_jt", action: "Write", resource: "System_Config", status: "Granted", time: "Just now", color: "text-emerald-500" },
    { user: "dev_user_04", action: "Execute", resource: "Prod_DB_Cluster", status: "Denied", time: "2m ago", color: "text-rose-500" },
    { user: "marketing_api", action: "Read", resource: "User_Analytics", status: "Granted", time: "5m ago", color: "text-emerald-500" },
    { user: "unknown_proxy", action: "Delete", resource: "Auth_Logs", status: "Blocked", time: "12m ago", color: "text-amber-500" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen  p-6 font-sans">
       <div className="mb-6">
              <Breadcrumb
                items={[
                  {
                    label: "Module Dashboard",
                    path: "/app/dashboard",
                  },
                  {
                    label: "Access Dashboard",
                  },
                ]}
              />
            </div>

            
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4  p-6 rounded-3xl  border backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase"> <span className="text-primary">Access</span> Control</h1>
              <p className="text-slate-400 text-sm font-medium"> Access Management Console</p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* <Button variant="outline" className="border-slate-700 bg-slate-900/50 hover:bg-slate-800">
              <History className="w-4 h-4 mr-2" /> Audit Trail
            </Button> */}
            <Button >
              <UserPlus className="w-4 h-4 mr-2" /> Invite User
            </Button>
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Roles", val: "24", icon: Users, color: "text-indigo-800" },
            { label: "Total Permissions", val: "124", icon: Key, color: "text-blue-400" },
            { label: "Permission Action", val: "240", icon: Fingerprint, color: "text-emerald-400" },
            { label: "Module", val: "6", icon: ShieldAlert, color: "text-rose-400" },
          ].map((stat, i) => (
            <Card key={i} className="backdrop-blur-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black mt-1">{stat.val}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Role Distribution & Health */}
          <div className="lg:col-span-4 space-y-8">
            <Card >
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-400" /> Policy Integrity
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <AccessStatusRing percent={99.8} color="#6366f1" label="Authorization Success" />
              </CardContent>
            </Card>

            <Card >
              <CardHeader className="border-b border-slate-800/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Role Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {roleDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {roleDistribution.map(role => (
                    <div key={role.name} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="text-xs font-medium text-foreground">{role.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Access Logs & Trends */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="  backdrop-blur-xl overflow-hidden shadow-2xl">
  <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 p-6">
    <div>
      <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-100">Access Trends</CardTitle>
      <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider">Hourly access granted vs. denied</p>
    </div>
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
        <span className="text-[10px] font-black text-slate-400 uppercase">Granted</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
        <span className="text-[10px] font-black text-slate-400 uppercase">Denied</span>
      </div>
    </div>
  </CardHeader>
  <CardContent className=" pb-6 px-2">
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={accessTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Indigo Glow for Granted */}
            <linearGradient id="glowGranted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            {/* Rose Glow for Denied */}
            <linearGradient id="glowDenied" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.03)" 
          />
          
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
          />

          <RechartsTooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />

          {/* Granted Area */}
          <Area
            type="monotone"
            dataKey="granted"
            stroke="#818cf8"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#glowGranted)"
            activeDot={{ 
                r: 6, 
                stroke: '#818cf8', 
                strokeWidth: 2, 
                fill: '#0f172a',
                className: "animate-pulse" 
            }}
          />

          {/* Denied Area */}
          <Area
            type="monotone"
            dataKey="denied"
            stroke="#f43f5e"
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#glowDenied)"
            activeDot={{ 
                r: 4, 
                stroke: '#f43f5e', 
                fill: '#0f172a' 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
            {/* Live Audit Log */}
            <Card >
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Live Authorization Stream</CardTitle>
                <Button variant="ghost" size="icon" className="text-slate-500"><MoreHorizontal className="w-5 h-5" /></Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase text-slate-500 tracking-tighter border-b border-slate-800/50">
                        <th className="px-6 py-4 font-bold">Principal</th>
                        <th className="px-6 py-4 font-bold">Action</th>
                        <th className="px-6 py-4 font-bold">Resource</th>
                        <th className="px-6 py-4 font-bold">Result</th>
                        <th className="px-6 py-4 font-bold text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {recentAccessLogs.map((log, i) => (
                        <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4 font-mono text-indigo-300">{log.user}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 font-mono text-[9px] uppercase">
                              {log.action}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-400">{log.resource}</td>
                          <td className={`px-6 py-4 font-bold ${log.color}`}>{log.status}</td>
                          <td className="px-6 py-4 text-right text-slate-500 font-mono">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
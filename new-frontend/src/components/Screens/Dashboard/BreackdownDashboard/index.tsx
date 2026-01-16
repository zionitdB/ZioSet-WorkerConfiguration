

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { useGet52WeekBreakdown, useGetBreakdownCountsByMachine, useGetBreakdownGraphData, useGetTotalCountBreakdowns, useGetTotalMachineCountBreakdowns } from "./hooks";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = {
  open: "#3B82F6",
  trial: "#f59e0b",
  closed: "#10b981",
};

// Helper functions
function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff =
    now.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
  const oneWeek = 604800000; // ms in one week
  return Math.ceil(diff / oneWeek);
}

function getWeekDateRange(year: number, weekNo: number) {
  const jan1 = new Date(year, 0, 1);
  const daysOffset = (weekNo - 1) * 7;
  const startDate = new Date(jan1.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  // Adjust to Monday
  const day = startDate.getDay(); // Sunday = 0
  const diffToMonday = day === 0 ? -6 : 1 - day;
  startDate.setDate(startDate.getDate() + diffToMonday);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  return { start: format(startDate), end: format(endDate) };
}

function getWeeksOfYear() {
  const weeks = [];
  const year = new Date().getFullYear();
  for (let i = 1; i <= 52; i++) {
    const { start, end } = getWeekDateRange(year, i);
    weeks.push({ weekNo: i, label: `Week ${i} (${start} → ${end})` });
  }
  return weeks;
}

  
export default function BreakdownDashboard() {
 const currentWeek = getCurrentWeekNumber();
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek);
  const year = new Date().getFullYear();
  const { start, end } = getWeekDateRange(year, selectedWeek);
  const { data} = useGet52WeekBreakdown(selectedWeek);

    const { data:countData } = useGetTotalCountBreakdowns();
       const { data:countMachineData } = useGetTotalMachineCountBreakdowns();
    const { data: graphMachineData = [] } = useGetBreakdownCountsByMachine();
     const { data:graphData = [] } = useGetBreakdownGraphData();


  const summary = [
    { title: "Open Breakdowns", value: countData?.openCount||0 },
    { title: "Closed Breakdowns", value: countData?.closedCount||0 },
    { title: "Trial Breakdowns", value: countData?.trialCount||0 },
    { title: "Total Breakdowns", value: countData?.totalBreakdowns||0 },
    { title: "Total Machines", value: countMachineData?.totalMachines||0 },
  ];

const byMachine = graphMachineData.map((item:any) => ({
  name: item.machineName?.trim(), 
  open: item.open ?? 0,
  trial: item.trail ?? 0, 
  closed: item.closed ?? 0,
}));


const byOwner = graphData.map((item:any) => ({
   name: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(),
  open: item.open ?? 0,
  trial: item.trail ?? 0, 
  closed: item.closed ?? 0,
}));


   const navigate = useNavigate();

const handleCardClick = (title: string) => {
  switch (title) {
    case "Open Breakdowns":
      navigate("/breakdowns-open");
      break;
    case "Closed Breakdowns":
      navigate("/breakdowns-closed");
      break;
    case "Trial Breakdowns":
      navigate("/breakdowns-trial");
      break;
    case "Total Breakdowns":
      navigate("/breakdowns-all");
      
      break;
          case "Total Machines":
      navigate("/total-breakdowns-machines");
      
      break;
    default:
      break;
  }
};




  const handleNavigate = () => {
    navigate("/breakdowns-machines"); 
  };

  const weeks = getWeeksOfYear();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-2">
        ⚙️ Breakdown Dashboard
      </h1>
         <p className="text-center text-sm text-muted-foreground mb-4">
        WEEK No :: {selectedWeek} → {start} to {end}
      </p>


      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {summary.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
                 onClick={() => handleCardClick(item.title)}
          >
            <Card className=" duration-300  hover:shadow-2xl transition-shadow border-t-4 border-transparent hover:border-primary  backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bar Charts */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
       {/* Breakdown by Machine */}
<Card>
  <CardHeader>
    <CardTitle>Breakdown Counts by Machine</CardTitle>
  </CardHeader>

  <CardContent>
    {/* Legend */}
    <div className="flex gap-4 mb-2">
      <span className="flex items-center gap-1 text-sm">
        <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span> Open
      </span>
      <span className="flex items-center gap-1 text-sm">
        <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span> Trial
      </span>
      <span className="flex items-center gap-1 text-sm">
        <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Closed
      </span>
    </div>

    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={byMachine} margin={{ top: 10, bottom: 20 }}>
      <XAxis dataKey="name" tick={{ fill: "var(--foreground)" }} />
    <YAxis tick={{ fill: "var(--foreground)" }} />
    <Tooltip />

        <Bar dataKey="open" fill="#3B82F6" radius={[6, 6, 0, 0]} />
        <Bar dataKey="trial" fill="#FACC15" radius={[6, 6, 0, 0]} />
        <Bar dataKey="closed" fill="#22C55E" radius={[6, 6, 0, 0]} />

        
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


        <Card>
          <CardHeader>
            <CardTitle>Breakdown Counts by Machine Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-2">
              <span className="flex items-center gap-1 text-sm">
                <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span>{" "}
                Open
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>{" "}
                Trial
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>{" "}
                Closed
              </span>
            </div>

            
<ResponsiveContainer width="100%" height={250}>
  <BarChart data={byOwner} margin={{ top: 10, bottom: 20 }}>
    <XAxis dataKey="name" tick={{ fill: "var(--foreground)" }} />
    <YAxis tick={{ fill: "var(--foreground)" }} />
    <Tooltip />

    <Bar dataKey="open" stackId="a" fill={COLORS.open} radius={[6, 6, 0, 0]} />
    <Bar dataKey="trial" stackId="a" fill={COLORS.trial} radius={[6, 6, 0, 0]} />
    <Bar dataKey="closed" stackId="a" fill={COLORS.closed} radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

 {/* Machine Breakdown List (Card Style) */}
<Card>
  <CardHeader className="flex justify-between items-center">
    <CardTitle className="text-base justify-between">
       Machine Breakdown Summary  <div className="flex justify-center mb-4 mt-2 gap-2 items-center">
  <span className="text-sm font-medium text-muted-foreground">Select Week:</span>

  <Select value={String(selectedWeek)} onValueChange={(val) => setSelectedWeek(Number(val))}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Select Week" />
    </SelectTrigger>
    <SelectContent>
      {weeks.map((w) => (
        <SelectItem key={w.weekNo} value={String(w.weekNo)}>
          {w.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
    </CardTitle>
    <button
      className="text-sm text-blue-600 hover:underline"
      onClick={handleNavigate}
    >
      {"Show More"}
    </button>
  </CardHeader>

  <CardContent className="space-y-4">
    { (data?.slice(0, 5) || []).map((machine:any, index:any) => {
      const week = machine.weekDatas?.[0] || {}; 
      return (
        <div
          key={index}
          className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-background shadow-sm"
        >
          <div className="mb-2 md:mb-0">
            <h4 className="font-semibold text-lg">
              {index + 1}. {machine.machineName}
            </h4>
            <p className="text-xs text-muted-foreground">
              Week No: {week.weekNo ?? "-"}
            </p>
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="font-medium text-muted-foreground">Open:</span>
              <span className="font-semibold">{week.open ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="font-medium text-muted-foreground">Trial:</span>
              <span className="font-semibold">{week.trail ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="font-medium text-muted-foreground">Closed:</span>
              <span className="font-semibold">{week.closed ?? 0}</span>
            </div>
          </div>
        </div>
      );
    })}
  </CardContent>
</Card>

    </div>
  );
}


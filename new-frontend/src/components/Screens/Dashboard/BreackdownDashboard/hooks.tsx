// src/app/general-breakdown/hooks.ts
import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";




export const useGetAllMachines = () =>
  useQuery({
    queryKey: ["useGetAllMachines"],
    queryFn: () => fetchData(`/machine_mst/list`),
  });


  export const useGetTotalBreakdwons = (machineId:any) =>
  useQuery({
    queryKey: ["useGetTotalBreakdwons",machineId],
    queryFn: () => fetchData(`/breakdown/report/${machineId}`),
        enabled:!!machineId,
  });



      export const useGetTotalRepitativeBreakdowns = (machineId:any) =>
  useQuery({
    queryKey: ["useGetTotalRepitativeBreakdowns",machineId],
    queryFn: () => fetchData(`/analysis_time_frames/report/${machineId}`),
        enabled:!!machineId,
  });


     export const useGet52WeekBreakdown = (weekNo: any) =>
  useQuery({
    queryKey: ["useGet52WeekBreakdown", weekNo],
    queryFn: () => fetchData(`/breakdown/get52WeekBreakDown?weekNo=${weekNo}`),
    enabled: !!weekNo,
  });

    export const useGetTotalCountBreakdowns = () =>
  useQuery({
    queryKey: ["useGetTotalCountBreakdowns"],
    queryFn: () => fetchData(`/breakdown/breakdownstatusCounts`),
  });

    export const useGetTotalMachineCountBreakdowns = () =>
  useQuery({
    queryKey: ["useGetTotalMachineCountBreakdowns"],
    queryFn: () => fetchData(`/dashboard/total_count`),
  });

  
  
    export const useGetBreakdownCountsByMachine = () =>
  useQuery({
    queryKey: ["useGetBreakdownCountsByMachine"],
    queryFn: () => fetchData(`/dashboard/getBreakdownCountsByMachine`),
  });
  
    export const useGetBreakdownGraphData = () =>
  useQuery({
    queryKey: ["useGetBreakdownGraphData"],
    queryFn: () => fetchData(`/dashboard/getBreakdownGraphData`),
  });

  
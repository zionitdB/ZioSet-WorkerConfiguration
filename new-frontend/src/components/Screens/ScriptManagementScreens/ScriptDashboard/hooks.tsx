import { fetchData, fetchDataSam } from "@/serviceAPI/serviceApi";
import {  useQuery } from "@tanstack/react-query";




export const useGetScripts = () => {
  return useQuery({
    queryKey: ["scripts"],
    queryFn: () => fetchData("/api/scripts"),
  });
};

export const useGetDashboardCountsData = (
scriptId:any
) => {
  return useQuery({
    queryKey: ["dashboard-counts", scriptId],
    queryFn: () => {
      const params = new URLSearchParams();

      if (scriptId) params.append("scriptId", scriptId);


      return fetchData(`/api/execution-results/app/dashboard-counts?${params.toString()}`);
    },
  });
};

export const useGetAvgExecutionMetric = (scriptId:any) => {
  return useQuery({
    queryKey: ["useGetAvgExecutionMetric",scriptId],
    queryFn: () => fetchData(`/api/script-dashboard/get-avg-execution-metric?scriptId=${scriptId}`),
    enabled:!!scriptId,
  });
};

export const useGetDashboardRecentExecution = (
scriptId:any
) => {
  return useQuery({
    queryKey: ["useGetDashboardRecentExecution", scriptId],
    queryFn: () => {
      const params = new URLSearchParams();

      if (scriptId) params.append("scriptId", scriptId);


      return fetchData(`/api/script-dashboard/get-recent-executions?${params.toString()}`);
    },
  });
};

export const useGetDashboardRecentExecutionAll = (
) => {
  return useQuery({
    queryKey: ["useGetDashboardRecentExecutionAll"],
    queryFn: () => {
 
      return fetchData(`/api/script-dashboard/get-recent-executions`);
    },
  });
};

export const useGetDashboardCounts = (
) => {
  return useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: () => {
 
      return fetchData(`/api/execution-results/app/dashboard-counts`);
    },
  });
};

export const useGetTemplatesCounts = (
) => {
  return useQuery({
    queryKey: ["useGetTemplatesCounts"],
    queryFn: () => {
 
      return fetchData(`/script-template/count`);
    },
  });
};


export const useGetSystemListCount = (activePlatform:any) => {
  return useQuery({
    queryKey: ["useGetSystemListCount",activePlatform],
    queryFn: () => fetchDataSam(`/api/sam/getAssetCount?osType=${activePlatform}`),
    enabled:!!activePlatform,
  });
};


export const useGetDashboardCountsByTimeline = (
) => {
  return useQuery({
    queryKey: ["useGetDashboardCountsByTimeline"],
    queryFn: () => {
 
      return fetchData(`/api/execution-results/last-24-hours-count`);
    },
  });
};


export const useGetDashboardCountsByTimelineByScriptId = (scriptId:any
) => {
  return useQuery({
    queryKey: ["useGetDashboardCountsByTimelineByScriptId",scriptId],
    queryFn: () => {
 
      return fetchData(`/api/execution-results/last-24-hours-count?scriptId=${scriptId}`);
    },
  });
};






export const useGetOverviewDashboardEndPoint= () => {
  return useQuery({
    queryKey: ["useGetOverviewDashboardEndPoint"],
    queryFn: () => fetchDataSam(`/app/dashboard/getOverviewDashboardEndPoint`),
  });
};
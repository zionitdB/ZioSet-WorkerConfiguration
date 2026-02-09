import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";



export const useGetScriptTypeCount = () => {
  return useQuery({
    queryKey: ["script-type-count"],
    queryFn: () =>
      fetchData("/api/script-dashboard/script-type-count"),
  });
};



export const useGetTargetSystemsCount = () => {
  return useQuery({
    queryKey: ["target-systems-count"],
    queryFn: () =>
      fetchData("/api/script-dashboard/targetSystems-count"),
  });
};


export const useGetExecutionsByScriptId = (
  scriptId?: number
) => {
  return useQuery({
    queryKey: ["script-executions", scriptId],
    queryFn: () =>
      fetchData(
        `/api/execution-results/getAllByScriptId?scriptId=${scriptId}`
      ),
    enabled: !!scriptId,
  });
};











// New hooks for location-wise data

/**
 * Get location list for a script and status
 * Returns: Array of { count: number, location: string }
 */
export const useGetLocationList = (scriptId?: number, status?: string) => {
  return useQuery({
    queryKey: ["location-list", scriptId, status],
    queryFn: () =>
      fetchData(
        `/api/execution-results/location-wise?scriptId=${scriptId}&status=${status}`
      ),
    enabled: !!scriptId && !!status,
  });
};

/**
 * Get execution results for one-time scripts (location-wise)
 * Returns: { message: string, location: string, data: Execution[] }
 */
export const useGetLocationWiseExecutions = (
  scriptId?: number,
  location?: string,
  status?: string
) => {
  return useQuery({
    queryKey: ["location-wise-executions", scriptId, location, status],
    queryFn: () =>
      fetchData(
        `/api/execution-results/location-wise-data?scriptId=${scriptId}&location=${encodeURIComponent(
          location || ""
        )}&status=${status}`
      ),
    enabled: !!scriptId && !!location && !!status,
  });
};

/**
 * Get target systems list for recurring scripts (location-wise)
 * Returns: Array of target system objects
 */
export const useGetLocationWiseTargetSystems = (
  scriptId?: number,
  location?: string,
  status?: string
) => {
  return useQuery({
    queryKey: ["location-wise-target-systems", scriptId, location, status],
    queryFn: () =>
      fetchData(
        `/api/execution-results/location-wise-targetSystems?scriptId=${scriptId}&location=${encodeURIComponent(
          location || ""
        )}&status=${status}`
      ),
    enabled: !!scriptId && !!location && !!status,
  });
};

/**
 * Get execution summary by serial number (for recurring scripts)
 * Returns: Array of execution objects
 */
export const useGetExecutionsBySerialNumber = (serialNo?: string) => {
  return useQuery({
    queryKey: ["executions-by-serial", serialNo],
    queryFn: () =>
      fetchData(
        `/api/execution-results/getSummaryBySerialNo?serialNo=${serialNo}`
      ),
    enabled: !!serialNo,
  });
};

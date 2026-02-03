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

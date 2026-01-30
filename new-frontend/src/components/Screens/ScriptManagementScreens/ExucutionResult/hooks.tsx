import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery } from "@tanstack/react-query";




export const useGetScripts = () => {
  return useQuery({
    queryKey: ["scripts"],
    queryFn: () => fetchData("/api/scripts"),
  });
};

export const useGetExecutionResults = (
  page: number,
  size: number,
  filters: {
    serialNumber: string;
    scriptId: string;
    hostName: string;
    finishedAfter: string;
    finishedBefore: string;
  }
) => {
  return useQuery({
    queryKey: ["execution-results", page, size, filters],
    queryFn: () => {
      const params = new URLSearchParams();

      if (filters.serialNumber) params.append("serialNumberOrHostName", filters.serialNumber);
      if (filters.scriptId) params.append("scriptId", filters.scriptId);
      if (filters.hostName) params.append("hostName", filters.hostName);
      if (filters.finishedAfter) params.append("finishedAfter",  `${filters.finishedAfter}T00:00:00.508Z`);
      if (filters.finishedBefore) params.append("finishedBefore",  `${filters.finishedBefore}T23:59:59.508Z`);

      params.append("page", String(page));
      params.append("size", String(size));

      return fetchData(`/api/execution-results?${params.toString()}`);
    },
  });
};



export const useGetExecutionsByScriptId = (scriptId: number | null) => {
  return useQuery({
    queryKey: ["useGetExecutionsByScriptId", scriptId],
    queryFn: () => fetchData(`/api/execution-results/getAllByScriptId?scriptId=${scriptId}`),
    enabled: !!scriptId,
  });
};



export const useGetExecutionByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/execution-results/getExecutionsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

export const useGetExecutionCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/execution-results/getExecutionsCountByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};
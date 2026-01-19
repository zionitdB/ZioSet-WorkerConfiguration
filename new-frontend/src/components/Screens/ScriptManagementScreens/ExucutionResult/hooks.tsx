import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useGetExecutionResults = (
  page: number, 
  size: number, 
  filters: { srNumber: string; startDate: string; endDate: string }
) => {
  return useQuery({
    queryKey: ["execution-results", page, size, filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.srNumber) params.append("serialNumber", filters.srNumber);
      if (filters.startDate) params.append("finishedAfter", `${filters.startDate}T00:00:00.508Z`);
      if (filters.endDate) params.append("finishedBefore", `${filters.endDate}T23:59:59.508Z`);
      
      params.append("page", page.toString());
      params.append("size", size.toString());

      return fetchData(`/api/execution-results?${params.toString()}`);
    },
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
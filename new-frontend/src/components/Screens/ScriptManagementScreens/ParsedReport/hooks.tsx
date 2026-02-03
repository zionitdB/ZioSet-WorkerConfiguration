import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetScripts = (page: number, size: number) => {
  return useQuery({
    queryKey: ["scripts", page, size],
    queryFn: () => fetchData(`/api/scripts?pageNo=${page}&perPage=${size}`),
  });
};


export const useGetParsedExecutionReport = (
  page: number,
  pageSize: number,
  filters: {
    scriptId: string;
    status: string;
    serialNumberOrHostName: string;
    finishedAfter: string;
    finishedBefore: string;
  }
) => {
  return useQuery({
    queryKey: ["execution-report-parsed", page, pageSize, filters],
    queryFn: () => {
      const params = new URLSearchParams();

      if (filters.scriptId) params.append("scriptId", filters.scriptId);
      if (filters.status) params.append("status", filters.status.toLowerCase());
      if (filters.serialNumberOrHostName) params.append("serialNumberOrHostName", filters.serialNumberOrHostName);
      
      if (filters.finishedAfter) params.append("finishedAfter", `${filters.finishedAfter}T00:00:00.000Z`);
      if (filters.finishedBefore) params.append("finishedBefore", `${filters.finishedBefore}T23:59:59.999Z`);

      params.append("page", String(page));
      params.append("pageSize", String(pageSize));

      return fetchData(`/api/execution-results/parsed-report?${params.toString()}`);
    },
  });
};

export const useGetScriptCount = () => {
  return useQuery({
    queryKey: ["scriptCount"],
    queryFn: () => fetchData(`/api/scripts/count`),
  });
};

export const useUpdateScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/scripts`, {
        method: "PUT", // or POST depending on your backend edit route
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError,
  });
};

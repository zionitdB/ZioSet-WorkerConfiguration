

import { fetchData, fetchDataSam } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOSDetails = () => {
  return useQuery({
    queryKey: ["osWiseDetails"],
    queryFn: () => fetchDataSam("/asset/getOSWiseDetailsData"),
  });
};

export const useGetTotalAssets = (page: number, size: number, date: string) => {
  return useQuery({
    queryKey: ["totalAssets", page, size, date],
    queryFn: () => fetchDataSam(`/asset/getAllAssetByPaginationByDate?pageNo=${page}&perPage=${size}&date=${date}`),
  });
};

export const useGetTotalAssetCount = (date: string) => {
  return useQuery({
    queryKey: ["totalAssetCount", date],
    queryFn: () => fetchDataSam(`/asset/getAllAssetCountByDate?date=${date}`),
  });
};

export const useSearchTotalAssets = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/asset/getAllAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

export const useSearchTotalAssetCount = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/asset/getCountAllAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};



//active asset
export const useGetActiveAssets = (page: number, size: number, date: string) => {
  return useQuery({
    queryKey: ["activeAssets", page, size, date],
    queryFn: () => fetchDataSam(`/asset/getActiveAssetListByPaginationAndDate?pageNo=${page}&perPage=${size}&date=${date}`),
  });
};

export const useGetActiveAssetCount = (date: string) => {
  return useQuery({
    queryKey: ["activeAssetCount", date],
    queryFn: () => fetchDataSam(`/asset/getActiveAssetCount?date=${date}`),
  });
};

export const useSearchActiveAssets = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/asset/getAllAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

export const useSearchActiveAssetCount = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/asset/getCountAllAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};





//inactive asset


export const useGetInActiveAssets = (page: number, size: number, date: string) => {
  return useQuery({
    queryKey: ["inActiveAssets", page, size, date],
    queryFn: () => fetchDataSam(`/asset/getInActiveAssetListByPaginationAndDate?pageNo=${page}&perPage=${size}&date=${date}`),
  });
};

export const useGetInActiveAssetCount = (date: string) => {
  return useQuery({
    queryKey: ["inActiveAssetCount", date],
    queryFn: () => fetchDataSam(`/asset/getInActiveAssetCount?date=${date}`),
  });
};

export const useSearchInActiveAssets = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/asset/getAllAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

export const useSearchInActiveAssetCount = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/asset/getCountAllAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};




export const useGetExecutionReport = (
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
    queryKey: ["execution-report", page, pageSize, filters],
    queryFn: () => {
      const params = new URLSearchParams();

      if (filters.scriptId) params.append("scriptId", filters.scriptId);
      if (filters.status) params.append("status", filters.status.toLowerCase());
      if (filters.serialNumberOrHostName) params.append("serialNumberOrHostName", filters.serialNumberOrHostName);
      
      if (filters.finishedAfter) params.append("finishedAfter", `${filters.finishedAfter}T00:00:00.000Z`);
      if (filters.finishedBefore) params.append("finishedBefore", `${filters.finishedBefore}T23:59:59.999Z`);

      params.append("page", String(page));
      params.append("pageSize", String(pageSize));

      return fetchData(`/api/execution-results/dashboard-statuswise?${params.toString()}`);
    },
  });
};








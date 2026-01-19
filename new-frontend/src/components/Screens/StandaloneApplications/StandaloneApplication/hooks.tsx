import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetStandaloneApps = (page: number, size: number) => {
  return useQuery({
    queryKey: ["useGetStandaloneApps", page, size],
    queryFn: () =>
      fetchData(`/standaloneApplicationController/getStandaloneApplicationByLimit?pageNo=${page}&perPage=${size}`),
  });
};

export const useGetStandaloneAppCount = () => {
  return useQuery({
    queryKey: ["useGetStandaloneAppCount"],
    queryFn: () => fetchData(`/standaloneApplicationController/getStandaloneApplicationCount`),
  });
};

export const useAddStandaloneApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/standaloneApplicationController/addNewStandaloneApplication`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetStandaloneApps"] });
    },
    onError,
  });
};

export const useUpdateStandaloneApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/standaloneApplicationController/updatedStatus`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetStandaloneApps"] });
    },
    onError,
  });
};

export const useDeleteStandaloneApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/standaloneApplicationController/deleteStandaloneApplication`, { method: "POST",  body: JSON.stringify(data), }),
    onSuccess: (data: any) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetStandaloneApps"] });
    },
    onError,
  });
};

export const useGetStandaloneAppsByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/standaloneApplicationController/getAllStandaloneApplicationByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetStandaloneAppCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/standaloneApplicationController/getCountAllStandaloneApplicationByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};
import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetInstalledSystems = (page: number, size: number) => {
  return useQuery({
    queryKey: ["getInstalledSystems", page, size],
    queryFn: () =>
      fetchData(`/installed-systems/getInstalledSystemEntityByLimit?pageNo=${page}&perPage=${size}`),
  });
};

export const useGetInstalledSystemsAll = () => {
  return useQuery({
    queryKey: ["useGetInstalledSystemsAll"],
    queryFn: () => fetchData(`/installed-systems/get-all-list`),
  });
};


export const useGetInstalledSystemsCount = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["getInstalledSystemsCount", startDate, endDate],
    queryFn: () => fetchData(`/installed-systems/get-count?startDate=${startDate}&endDate=${endDate}`),
        enabled:!!startDate&&!!endDate
  });
};

export const useSearchInstalledSystems = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/installed-systems/getAllInstalledSystemEntityByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useSearchInstalledSystemsCount = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/installed-systems/getCountAllInstalledSystemEntityByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};





export const useBulkDeleteByExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, deletedById }: { formData: FormData, deletedById: string }) =>
      fetchData(`/installed-systems/delete-multiple-using-excel?deletedById=${deletedById}`, {
        method: "POST",
         body: formData,
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetInstalledSystemsAll"] });
    },
    onError,
  });
};

export const useBulkDeleteBySelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:(payload: { serialNumbers: string[], deletedById: string })  =>
      fetchData(`/installed-systems/delete-multiple-serial_numbers`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetInstalledSystemsAll"] });
    },
    onError,
  });
};





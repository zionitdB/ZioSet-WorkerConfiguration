import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetUnregisteredAssets = (page: number, size: number) => {
  return useQuery({
    queryKey: ["getUnregisteredAssets" , page, size],
    queryFn: () => fetchData(`/unregistered-assets/getUnRegisteredAssetsByLimit?pageNo=${page}&perPage=${size}`),
  });
};

export const useDeleteUnregisteredAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) =>
      fetchData(`/unregistered-assets/delete-by-system-serial-number?serialNumber=${id}`, { method: "DELETE" }),
    onSuccess: (data: any) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["getUnregisteredAssets"] });
    },
    onError,
  });
};


export const useSearchUnregisteredAssets = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/unregistered-assets/getAllUnRegisteredAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};


export const useSearchUnregisteredCount = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/unregistered-assets/getCountAllUnRegisteredAssetsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};
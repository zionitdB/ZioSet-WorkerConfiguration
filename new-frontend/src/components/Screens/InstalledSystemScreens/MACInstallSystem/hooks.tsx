import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};


export const useGetMacInstalledSystems =(page: number, size: number) => {
  return useQuery({
    queryKey: ["getMacInstalledSystems",page,size],
    queryFn: () => fetchData(`/mac-installed-systems/getMACInstalledSystemEntityByLimit?pageNo=${page}&perPage=${size}`),
  });
};


export const useSearchMacSystems = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/mac-installed-systems/getAllMACInstalledSystemEntityByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError: (error: any) => toast.error(error?.message || "Search Failed"),
  });
};


export const useSearchMacSystemsCount = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/mac-installed-systems/getCountAllMACInstalledSystemEntityByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError: (error: any) => toast.error(error?.message || "Search Failed"),
  });
};




export const useBulkDeleteByExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, deletedById }: { formData: FormData, deletedById: string }) =>
      fetchData(`/mac-installed-systems/delete-multiple-using-excel?deletedById=${deletedById}`, {
        method: "POST",
         body: formData,


      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetMacInstalledSystems"] });
    },
    onError,
  });
};

export const useBulkDeleteBySelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:(payload: { serialNumbers: string[], deletedById: string })  =>
      fetchData(`/mac-installed-systems/delete-multiple-serial_numbers`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetMacInstalledSystems"] });
    },
    onError,
  });
};





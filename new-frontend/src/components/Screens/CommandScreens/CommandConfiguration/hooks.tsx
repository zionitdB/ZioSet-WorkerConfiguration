

import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetCommands = (page: number, perPage: number) => {
  return useQuery({
    queryKey: ["commands", page, perPage],
    queryFn: () =>
      fetchData(`/configuration/getCommandConfigurationByLimit?pageNo=${page}&perPage=${perPage}`),
  });
};

export const useGetCommandCount = () => {
  return useQuery({
    queryKey: ["commands-count"],
    queryFn: () => fetchData("/configuration/getCommandConfigurationCount"),
  });
};

export const useGetActions = () => {
  return useQuery({
    queryKey: ["actions"],
    queryFn: () => fetchData("/configuration/getAllActions"),
  });
};

export const useGetCommandsByActionFilter = () => {
  return useMutation({
    mutationFn: ({ actionId }: any) =>
      fetchData(`/configuration/getAllCommandConfigurationByActionId?actionId=${actionId}`),
  });
};

export const useAddCommand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/createCommandConfiguration", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>   qc.invalidateQueries({ queryKey: ["commands"] }),
        
  });
};

export const useUpdateCommand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/editCommandConfiguration", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>   qc.invalidateQueries({ queryKey: ["commands"] }),
  });
};

export const useDeleteCommand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchData(`/configuration/deleteCommandConfiguration/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>   qc.invalidateQueries({ queryKey: ["commands"] }),
  });
};



export const useGetCommandByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/configuration/getAllCommandConfigurationByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetCommandCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/configuration/getCountAllCommandConfigurationByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};
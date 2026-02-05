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
    queryFn: () => fetchData(`/api/scripts/getScriptEntityByLimit?pageNo=${page}&perPage=${size}`),
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


export const useUpdateScriptEnabled = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/scripts/${data.id}/enable`, {
        method: "PATCH", 
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError,
  });
};


export const useUpdateScriptDisabled = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/scripts/${data.id}/disable`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError,
  });
};

export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchData(`/api/scripts/${id}`, { method: "DELETE" }),
    onSuccess: (data: any) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError,
  });
};

export const useGetScriptsByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/scripts/getScriptsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetScriptCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/scripts/getScriptsCountByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};







export const useGetTargetSystems = (id: any) => {
  return useQuery({
    queryKey: ["useGetTargetSystems", id],
    queryFn: () => fetchData(`/api/scripts/${id}/targetSystems`),
  });
};


export const useDeleteTargetSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id:any) =>
      fetchData(`/agent-update/delete-target-system-by-id/${id}`, { method: "GET" }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetTargetSystems"] });
      onSuccess(data);
    },
    onError,
  });
};

import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => toast.success(data?.message || "Operation Successful");
const onError = (error: any) => toast.error(error?.message || "Operation Failed");

export const useGetAgentUpdates = (page: number, size: number) => {
  return useQuery({
    queryKey: ["useGetAgentUpdates", page, size],
    queryFn: () => fetchData(`/agent-update/get-all-updates?pageNo=${page}&perPage=${size}`),
  });
};

export const useAddAgentUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchData(`/agent-update/add-update`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetAgentUpdates"] });
    },
    onError,
  });
};


export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (Id:any) =>
      fetchData(`/agent-update/delete-update/${Id}`, { method: "GET" }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetAgentUpdates"] });
      onSuccess(data);
    },
    onError,
  });
};


export const useGetInstalledSystems = () => {
  return useQuery({
    queryKey: ["useGetInstalledSystems"],
    queryFn: () => fetchData("/installed-systems/get-installed-systems-list"),
    select: (data: any) => data?.map((item: any) => ({
      id: item.systemSerialNo,
      serialNo: item.systemSerialNo,
      installedAt: item.installedAt,
    })) || [],
  });
};

// Assuming you have similar search endpoints for Agent Updates
export const useGetAgentUpdatesSearch = () => {
  return useMutation({
    mutationFn: (payload: any) => fetchData("/agent-update/search", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onError,
  });
};


//////
//for target system





export const useGetTargetSystems = (uuid: any) => {
  return useQuery({
    queryKey: ["useGetTargetSystems", uuid],
    queryFn: () => fetchData(`/agent-update/get-systems/${uuid}`),
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




export const useGetUsersByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/user/getUserDetailsByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetUserCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/user/getUserDetailsCountByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};


export const useGetAgentUpdatesByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/agent-update/getAllAgentUpdateSystemsEntityByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetAgentUpdateCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/agent-update/getCountAllAgentUpdateSystemsEntityByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};


export const useUploadAgentSystemsExcel = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await fetchData("/contact/uploadExcel", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (res: any) => {
      onSuccess(res.message || "Excel uploaded successfully");
    },
    onError,
  });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, fetchDataSam } from "@/serviceAPI/serviceApi";
import toast from "react-hot-toast";




export const useGetScriptTypes = () => {
  return useQuery({
    queryKey: ["scriptTypes"],
    queryFn: () => fetchData("/api/scripts/types"),
  });
};


export const useGetParamTypes = () => {
  return useQuery({
    queryKey: ["paramTypes"],
    queryFn: () => fetchData("/script-template/param-type"),
  });
};


export const useGetPlatforms = () => {
  return useQuery({
    queryKey: ["platforms"],
    queryFn: () => fetchData("/api/scripts/platforms"),
  });
};

export const useGetSystemList = (endpoint: string) => {
  return useQuery({
    queryKey: ["systems", endpoint],
    queryFn: () => fetchDataSam(endpoint),
  });
};

export const useGetSystemListCount = (activePlatform:any) => {
  return useQuery({
    queryKey: ["useGetSystemListCount",activePlatform],
    queryFn: () => fetchDataSam(`/api/sam/getAssetCount?osType=${activePlatform}`),
    enabled:!!activePlatform,
  });
};


export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const user = JSON.parse(sessionStorage.getItem('agentUser') || '{}');
      const uploadedBy = user?.userName || "system admin";
      const formData = new FormData();
      formData.append("file", file);
      return fetchData(`/api/script-files/upload?uploadedBy=${uploadedBy}`, {
        method: "POST",
        body: formData,
        headers: {}, 
      });
    },
  });
};

export const useSubmitScript = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/scripts/simple-create", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => toast.success("Script created successfully!"),
    onError: (err: any) => toast.error(err?.message || "Failed to create script"),
  });
};




export const useGetScriptTemplatesList = (page:any,pageSize:any) => {
  return useQuery({
    queryKey: ["useGetScriptTemplatesList",page,pageSize],
    queryFn: () => fetchData(`/script-template?page=${page}&size=${pageSize}`),
  });
};


export const useSubmitScriptTemplate = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/script-template", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => toast.success("Script Template created successfully!"),
    onError: (err: any) => toast.error(err?.message || "Failed to create script"),
  });
};


export const useDeleteScriptTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (Id:any) =>
      fetchData(`/script-template/${Id}`, { method: "DELETE" }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetScriptTemplatesList"] });
    toast.success(data?.message || "Script Template Deleted Successfully!!")
      
    },
   onError: (err: any) => toast.error(err?.message || "Failed to delete script"),
  });
};



export const useGetAllAssetByLimitAndGroupSearch= () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/api/sam/getAllAssetByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
 onError: (err: any) => toast.error(err?.message || "Failed to search system"),
  });
};

export const useGetCountAllAssetByLimitAndGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchDataSam("/api/sam/getCountAllAssetByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  onError: (err: any) => toast.error(err?.message || "Failed to search system"),
  });
};


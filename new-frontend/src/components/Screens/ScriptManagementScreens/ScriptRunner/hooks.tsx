import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchData } from "@/serviceAPI/serviceApi";
import toast from "react-hot-toast";

export const useGetScriptTypes = () => {
  return useQuery({
    queryKey: ["scriptTypes"],
    queryFn: () => fetchData("/api/scripts/types"),
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
    queryFn: () => fetchData(endpoint),
    select: (data) => data?.map((item: any) => ({
      id: item.systemSerialNo,
      serialNo: item.systemSerialNo,
      installed: item.installed,
      installedAt: item.installedAt,
      installReqAt: item.installReqAt,
    })) || [],
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
      fetchData("/api/scripts", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => toast.success("Script created successfully!"),
    onError: (err: any) => toast.error(err?.message || "Failed to create script"),
  });
};
import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.response?.data?.message || error?.message || "Operation Failed");
};


export const useGetScriptsByStatus = (status: 'pending' | 'approved'|'rejected', page: number, size: number) => {
  return useQuery({
    queryKey: ["scripts", status, page, size],
    queryFn: () => fetchData(`/api/scripts/${status}?page=${page}&size=${size}`),
  });
};

export const useScriptActions = () => {
  const queryClient = useQueryClient();

  const approveScript = useMutation({
    mutationFn: (id: number) =>
      fetchData(`/api/scripts/${id}/approve`, {
        method: "PUT",
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError,
  });

  const rejectScript = useMutation({
    mutationFn: (id: number) =>
      fetchData(`/api/scripts/${id}/reject`, {
        method: "PUT",
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError,
  });

  return { 
    approve: approveScript, 
    reject: rejectScript 
  };
};
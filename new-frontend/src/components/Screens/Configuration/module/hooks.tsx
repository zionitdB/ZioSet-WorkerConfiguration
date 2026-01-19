import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};


export const useGetModules = () => {
  return useQuery({
    queryKey: ["useGetModules"],
    queryFn: () => fetchData("/access/getAllModule"),
  });
};


export const useAddModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/access/addModule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetModules"] });
      onSuccess(data);
    },
    onError,
  });
};


export const useUpdateModule = (moduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/access/updateModule/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["useGetModules"] });
      onSuccess(data);
    },
    onError,
  });
};

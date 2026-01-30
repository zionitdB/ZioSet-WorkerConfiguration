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
    queryFn: () => fetchData(`/api/scripts?pageNo=${page}&perPage=${size}`),
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

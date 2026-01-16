import { fetchData } from "@/serviceAPI/serviceApi";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const onSuccess = (msg?: string) => toast.success(msg || "Operation successful");
const onError = (err: any) => toast.error(err?.message || "Operation failed");

export const useGetUserById = (id:any) => {
  return useQuery({
    queryKey: ["useGetUserById",id],
    queryFn: () => fetchData(`/user/getUserById/${id}`),
    enabled:!!id
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/user/admin/changePassword`, {
        method: "PUT",
          body: JSON.stringify(data),
      }),
    onSuccess: (res: any) => {
      onSuccess(res.message);
      queryClient.invalidateQueries({ queryKey: ["useGetUserById"] });
    },
    onError,
  });
};
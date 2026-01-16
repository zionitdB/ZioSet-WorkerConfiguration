import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetRole = () => {
  return useQuery({
    queryKey: ["useGetRole"],
    queryFn: () => fetchData("/access/getRoles"),
  });
};

export const useRolesRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/access/addRole", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetRole"] }); // Invalidate table data
      onSuccess(data);
    },
    onError: onError,
  });
};

export const useUpdaterole = (roleId: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/roles/${roleId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetRole"] }); // Invalidate table data
      onSuccess(data);
    },
    onError: onError,
  });
};

export const useDeleteRole = (roleId: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchData(`/api/roles/${roleId}`, {
        method: "DELETE",
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetRole"] }); // Invalidate table data
      onSuccess(data);
    },
    onError: onError,
  });
};

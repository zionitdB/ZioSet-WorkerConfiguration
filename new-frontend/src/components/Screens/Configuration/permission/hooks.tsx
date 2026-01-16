
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

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["useGetPermissions"],
    queryFn: () => fetchData("/access/getAllPermissions"),
  });
};

export const usePermissionsRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/access/addPermission", {
        method: "POST",
         headers: {
    'Content-Type': 'application/json',
  },
        body: JSON.stringify(data),
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetPermissions"] });
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
         headers: {
    'Content-Type': 'application/json',
  },
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

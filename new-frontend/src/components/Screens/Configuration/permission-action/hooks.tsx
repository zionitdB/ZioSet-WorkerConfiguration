
import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["useGetPermissions"],
    queryFn: () => fetchData("/access/getAllPermissions"),
  });
};

export const useGetPermissionsActions = () => {
  return useQuery({
    queryKey: ["useGetPermissionsActions"],
    queryFn: () =>fetchData("/access/getPermissionAction"),
  });
};
export const usePermissionsRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/access/addPermissionMultipleActionNew", {
        method: "POST",
          headers: {
    'Content-Type': 'application/json',
  },
        body: JSON.stringify(data),
      }),
    onSuccess: (data: any) => {

      if (data?.code===500) {
        toast.error(data?.message||"This permission action already exists.");
      } else {
        queryClient.invalidateQueries({ queryKey: ["useGetPermissionsActions"] }); 
        toast.success("Permission action added successfully.");
      }
      queryClient.invalidateQueries({ queryKey: ["useGetPermissionsActions"] }); 
      // onSuccess(data);
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


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

export const useGetPermissionsAndActionsByRole = (roleId: any) => {
  return useQuery({
    queryKey:  ["useGetPermissionsAndActionsByRole", roleId], 
    queryFn:  () => fetchData(`/access/getPermissionsAndActionByRole1?roleId=${roleId}`),
    enabled:!!roleId, 
 } );
};

export const useUpdateRolePermissionsAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/access/updateRolePermissionAction", {
        method: "POST",
         headers: {
    'Content-Type': 'application/json',
  },
        body: JSON.stringify(data),
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetPermissionsAndActionsByRole"] }); 
      onSuccess(data);
    },
    onError: onError,
  });
};



export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/access/updateRolePermission", {
        method: "POST",
         headers: {
    'Content-Type': 'application/json',
  },
        body: JSON.stringify(data),
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetPermissionsAndActionsByRole"] }); 
      onSuccess(data);
    },
    onError: onError,
  });
};



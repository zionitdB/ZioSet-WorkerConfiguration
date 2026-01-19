import { fetchData } from "@/serviceAPI/serviceApi";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const onSuccess = (msg?: string) => toast.success(msg || "Operation successful");
const onError = (err: any) => toast.error(err?.message || "Operation failed");

export const useGetAllNotifications = (departmentName:any) => {
  return useQuery({
    queryKey: ["useGetAllNotifications",departmentName],
    queryFn: () => fetchData(`/notification/getAllNotificationByDept?deptName=${departmentName}`),
    enabled:!!departmentName,
  });
};

export const useGetReadNotifications = (departmentName:any) => {
  return useQuery({
    queryKey: ["useGetReadNotifications",departmentName],
    queryFn: () => fetchData(`/notification/getAllNotificationViewByDept?deptName=${departmentName}`),
       enabled:!!departmentName,
  });
};

export const useGetUnreadNotifications = (departmentName:any) => {
  return useQuery({
    queryKey: ["useGetUnreadNotifications",departmentName],
    queryFn: () => fetchData(`/notification/getAllNotificationUnViewByDept?deptName=${departmentName}`),
       enabled:!!departmentName,
  });
};


export const useUpdateViewNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) =>
      fetchData(`/notification/markAsViewed/${id}`, {
        method: "PUT",
      }),
    onSuccess: (res: any) => {
      onSuccess(res.message);
      queryClient.invalidateQueries({ queryKey: ["useGetAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["useGetReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["useGetUnreadNotifications"] });
    },
    onError,
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) =>
      fetchData(`/notification/deleteNotification/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (res: any) => {
      onSuccess(res.message);
      queryClient.invalidateQueries({ queryKey: ["useGetAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["useGetReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["useGetUnreadNotifications"] });
    },
    onError,
  });
};
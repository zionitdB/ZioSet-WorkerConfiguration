
import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetUsers = (page: number, size: number, keyword: string = "") => {
  return useQuery({
    queryKey: ["useGetUsers", page, size, keyword],
    queryFn: () =>
      fetchData(`/api/user/getAllByPagination?pageNo=${page}&perPage=${size}`),
  });
};

export const useGetUserCount = (keyword: string = "") => {
  return useQuery({
    queryKey: ["useGetUserCount", keyword],
    queryFn: () => fetchData(`/api/user/getUserInfoCount`),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/user/addUser`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetUsers"] });
    },
    onError,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/api/user/updateUser`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetUsers"] });
    },
    onError,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId:any) =>
      fetchData(`/api/user/${userId}`, { method: "DELETE" }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetUsers"] });
      onSuccess(data);
    },
    onError,
  });
};




export const useGetUsersByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/user/getUserInfoByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetUserCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/api/user/getCountUserInfoByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};


export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["useGetDepartments"],
    queryFn: () => fetchData("/user/getAllDepartments"),
  });
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["useGetRoles"],
    queryFn: () => fetchData("/access/getRoles"),
  });
};
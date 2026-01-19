import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};


export const useGetActions = (
  page: number,
  size: number,
  keyword: string = ""
) => {
  return useQuery({
    queryKey: ["useGetActions", page, size, keyword],
    queryFn: () =>
      fetchData(
        `/configuration/getActionByLimit?pageNo=${page}&perPage=${size}`
      ),
  });
};


export const useGetActionCount = (keyword: string = "") => {
  return useQuery({
    queryKey: ["useGetActionCount", keyword],
    queryFn: () => fetchData(`/configuration/getActionCount`),
  });
};


export const useAddAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/configuration/addNewAction`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetActions"] });
    },
    onError,
  });
};


export const useUpdateAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/configuration/addNewAction`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetActions"] });
    },
    onError,
  });
};


export const useDeleteAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionId: any) =>
      fetchData(`/configuration/deleteAction`, {
        method: "POST",
              body: JSON.stringify({id:actionId}),
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetActions"] });
      onSuccess(data);
    },
    onError,
  });
};



export const useGetActionsByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/configuration/getAllActionByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetActionCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/configuration/getCountAllActionByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};



export const useGetCategories = () => {
  return useQuery({
    queryKey: ["useGetCategories"],
    queryFn: () => fetchData(`/configuration/getAllCategories`),
  });
};

export const useGetSubCategories = () => {
  return useMutation({
    mutationFn: (parentCategoryId: number) =>
      fetchData(
        `/configuration/getAllCategoryByParentId?parentCategoryId=${parentCategoryId}`
      ),
    onError,
  });
};

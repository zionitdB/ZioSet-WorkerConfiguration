import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => toast.success(data?.message || "Operation Successful");
const onError = (error: any) => toast.error(error?.message || "Operation Failed");

// Get categories with pagination & optional search
export const useGetCategories = (page: number, size: number) => {
  return useQuery({
    queryKey: ["useGetCategories", page, size],
    queryFn: () =>
      fetchData(`/configuration/getCategoryByLimit?pageNo=${page}&perPage=${size}`),
  });
};

export const useGetChildCategories = (id: number, p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: ["useGetChildCategories", id ],
    queryFn: () =>
      fetchData(`/configuration/getAllCategoryByParentId?parentCategoryId=${id}`),
  });
};


export const useGetParentCategory = (id: number) => {
  return useQuery({
    queryKey: ["useGetParentCategory", id ],
    queryFn: () =>
      fetchData(`/configuration/getAllCategoriesTreeById?categoryId=${id}`),
  });
};

// Get total categories count
export const useGetCategoryCount = () => {
  return useQuery({
    queryKey: ["useGetCategoryCount"],
    queryFn: () => fetchData(`/configuration/getCategoryCount`),
  });
};

// Add Category
export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/addNewCategory", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetCategories"] });
    },
    onError,
  });
};

// Update Category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/addNewCategory", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetCategories"] });
    },
    onError,
  });
};

// Delete Category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) =>
      fetchData(`/configuration/deleteCategory`, { method: "POST" ,  body: JSON.stringify({id:categoryId}),}),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetCategories"] });
    },
    onError,
  });
};



export const useGetCategoryByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/configuration/getAllCategoryByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetCategoryCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData("/configuration/getCountAllCategoryByLimitAndGroupSearch", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};




export const useGetCategoriesDropdown = () => {
  return useQuery({
    queryKey: ["useGetCategoriesDropdown"],
    queryFn: () => fetchData("/configuration/getAllCategories"),
  });
};

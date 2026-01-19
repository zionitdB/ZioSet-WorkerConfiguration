

import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};
const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};

export const useGetCommands = (page: number, perPage: number) => {
  return useQuery({
    queryKey: ["commands", page, perPage],
    queryFn: () =>
      fetchData(`/configuration/getCommandConfigurationByLimit?pageNo=${page}&perPage=${perPage}`),
  });
};

export const useGetCommandCount = () => {
  return useQuery({
    queryKey: ["commands-count"],
    queryFn: () => fetchData("/configuration/getCommandConfigurationCount"),
  });
};


export const useGetNewCommandId = () => {
  return useQuery({
    queryKey: ["GetNewCommandId"],
    queryFn: () => fetchData("/configuration/getNewCommandId"),
  });
};

export const useGetActions = () => {
  return useQuery({
    queryKey: ["actions"],
    queryFn: () => fetchData("/configuration/getAllActions"),
  });
};

export const useGetCommandsByActionFilter = ( actionId :any,page:any,perPage: any) => {
  return useQuery({
    queryKey: ["useGetCommandsByActionFilter",actionId ,page,perPage],
    queryFn: () => fetchData(`/configuration/getAllCommandConfigurationByActionIdPagination?actionId=${actionId}&pageNo=${page}&perPage=${perPage}`),
       enabled: !!actionId,
  });
};


// export const useGetCommandsByActionFilter = ( actionId :any,page:any,perPage: any)=> {
//   return useMutation({
//     mutationFn: ({ actionId ,page,perPage}: any) =>
//       fetchData(`/configuration/getAllCommandConfigurationByActionIdPagination?actionId=${actionId}&pageNo=${page}&perPage=${perPage}`),
//   });
// };
   

export const useAddCommand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/addNewCommandConfiguration", {
        method: "POST",
        body: JSON.stringify(data),
      }),
        onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["commands"] });
    },  
       onError,
  });
};

export const useUpdateCommand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/updateCommandConfiguration", {
        method: "POST",
        body: JSON.stringify(data),
      }),
       onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["commands"] });
    },  
       onError,
  });
};

export const useDeleteCommand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchData(`/configuration/delteCommandConfiguration`, {
        method: "POST",
        body: JSON.stringify({ id }),
      }),
       onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["commands"] });
    },  
       onError,
  });
};



export const useGetCommandByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/configuration/getAllCommandConfigurationByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};

export const useGetCommandCountByGroupSearch = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetchData(`/configuration/getCountAllCommandConfigurationByLimitAndGroupSearch`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onError,
  });
};
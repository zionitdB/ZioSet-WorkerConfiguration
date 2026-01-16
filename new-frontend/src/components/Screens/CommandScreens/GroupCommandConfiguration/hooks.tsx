import { fetchData } from "@/serviceAPI/serviceApi"; 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const onSuccess = (data: any) => {
  toast.success(data?.message || "Operation Successful");
};

const onError = (error: any) => {
  toast.error(error?.message || "Operation Failed");
};


export const useGetAllActions = () => {
  return useQuery({
    queryKey: ["useGetAllActions"],
    queryFn: () => fetchData("/configuration/getAllActions"),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useGetCommandIdListByAction = (actionId: string | null) => {
  return useQuery({
    queryKey: ["useGetCommandIdListByAction", actionId],
    queryFn: () =>
      actionId
        ? fetchData(`/configuration/getCommandIdListByAction?actionId=${actionId}`)
        : Promise.resolve([]), 
    enabled: !!actionId,
  });
};


export const useGetCommandsByCommandId = (page:any,rowsPerPage:any,commandId: string | null) => {
  return useQuery({
    queryKey: ["useGetCommandsByCommandId",page ,rowsPerPage,commandId],
    queryFn: () =>
      commandId
        ? fetchData(`/configuration/getCommandsByCommandIdPage?pageNo=${page}&perPage=${rowsPerPage}&commandId=${commandId}`)
        : Promise.resolve([]),
    enabled: !!commandId, 
    staleTime: 0,
  });
};



export const useAddCommandConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/createCommandConfig", { 
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetCommandsByCommandId"] });
    },
    onError,
  });
};

export const useUpdateCommandConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      fetchData("/configuration/editCommandConfig", { 
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ["useGetCommandsByCommandId"] });
    },
    onError,
  });
};

export const useDeleteCommandConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetchData(`/configuration/deleteCommandConfig/${id}`, { method: "DELETE" }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["useGetCommandsByCommandId"] });
      onSuccess(data);
    },
    onError,
  });
};
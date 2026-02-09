
import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";


//total open ppm
export const useGetTotalOpenPPM = (fromDate:any,toDate:any) =>
  useQuery({
    queryKey: ["useGetTotalOpenPPM",fromDate,toDate],
    queryFn: () => fetchData(`/maint/total_openmaintenance?fromDate=${fromDate}&toDate=${toDate}`),
  });
export const useGetTotalOpenPPMCount = () =>
  useQuery({
    queryKey: ["useGetTotalPPMCounts"],
    queryFn: () => fetchData(`/app/dashboard/maintaince_count`),
  });




  export const useGetPPMClosedApprovalss = (machineId: any) =>
  useQuery({
    queryKey: ["useGetPPMClosedApprovalss", machineId],
    queryFn: () => fetchData(`/maint/getClosedApprovalss/${machineId}`),
    enabled: !!machineId,
  });

     export const useGetApprovalss = () =>
  useQuery({
    queryKey: ["useGetApprovalss"],
    queryFn: () => fetchData(`/maint/getClosedApprovals`),
  });

    export const useGetUnApprovalss = () =>
  useQuery({
    queryKey: ["useGetUnApprovalss"],
    queryFn: () => fetchData(`/maint/getUnApprovals`),
  });
  

  

export const useGetAllPPMHistory = (machineId: any,fromDate:any,toDate:any) =>
  useQuery({
    queryKey: ["useGetAllPPMHistory", machineId,fromDate,toDate],
    queryFn: () => fetchData(`/app/dashboard/maintaince_records/${machineId}?fromDate=${fromDate}&toDate=${fromDate}`),
    enabled: !!machineId,
  });


  
    export const useGet52WeekMaintenence = (machineId: any) =>
  useQuery({
    queryKey: ["useGet52WeekMaintenence", machineId],
    queryFn: () => fetchData(`/maint/get52WeekMaintenence?weekNo=${machineId}`),
    enabled: !!machineId,
  });


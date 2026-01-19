import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";



export const useGetTotalOverdueMaintenance = (
  fromDate: any,
  toDate: any,
  keyword: any,
  page: any,
  size: any
) =>
  useQuery({
    queryKey: [
      "useGetTotalOverdueMaintenance",
      fromDate,
      toDate,
      keyword,
      page,
      size,
    ],
    queryFn: () =>
      fetchData(
        `/dashboard2/totalTrialBreakdownsWithPageSearchDatewise?fromDate=${fromDate}&toDate=${toDate}&keyword=${keyword}&page=${page}&size=${size}`
   
      ),
  });


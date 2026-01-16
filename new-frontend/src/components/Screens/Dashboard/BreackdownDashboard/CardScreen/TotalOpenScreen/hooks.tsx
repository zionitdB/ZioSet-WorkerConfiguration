import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";



export const useGetTotalOpenMaintenance = (
  fromDate: any,
  toDate: any,
  keyword: any,
  page: any,
  size: any
) =>
  useQuery({
    queryKey: [
      "useGetTotalOpenMaintenance",
      fromDate,
      toDate,
      keyword,
      page,
      size,
    ],
    queryFn: () =>
      fetchData(
        `/dashboard2/totalOpenBreakdownsWithPageSearchDatewise?fromDate=${fromDate}&toDate=${toDate}&keyword=${keyword}&page=${page}&size=${size}`

      ),
  });


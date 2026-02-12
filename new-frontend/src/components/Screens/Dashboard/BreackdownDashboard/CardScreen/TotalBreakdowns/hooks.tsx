import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";



export const useGetTotalMaintenance = (
  fromDate: any,
  toDate: any,
  keyword: any,
  page: any,
  size: any
) =>
  useQuery({
    queryKey: [
      "useGetTotalMaintenance",
      fromDate,
      toDate,
      keyword,
      page,
      size,
    ],
    queryFn: () =>
      fetchData(
        `/app/dashboard2/totalBreakdownsWithPageSearchDatewise?fromDate=${fromDate}&toDate=${toDate}&keyword=${keyword}&page=${page}&size=${size}`

      ),
  });


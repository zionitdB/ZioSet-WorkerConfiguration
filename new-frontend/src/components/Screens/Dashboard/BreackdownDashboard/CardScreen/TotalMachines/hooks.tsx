import { fetchData } from "@/serviceAPI/serviceApi";
import { useQuery } from "@tanstack/react-query";



export const useGetTotalMachine = (

  keyword: any,
  page: any,
  size: any
) =>
  useQuery({
    queryKey: [
      "useGetTotalMachine",
   
      keyword,
      page,
      size,
    ],
    queryFn: () =>
      fetchData(
      `/machine_mst/PagelistSearch?page=${page}&size=${size}&searchText=${keyword}`
      ),
  });


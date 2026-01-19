

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { useGetTotalMachine } from "./hooks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";


const TotalMachineScreen = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const {
    data: maintenanceResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetTotalMachine( keyword, page, rowsPerPage);

  const maintenanceData = maintenanceResponse?.machines || [];
  const totalItems = maintenanceResponse?.totalItems || 0;
  const totalPages = maintenanceResponse?.totalPages || 0;



  const columnDefs = useMemo(
    () => [
       {
      headerName: "Sr No",
      valueGetter: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1)
,
      width: 80,
      filter: false,
    },
      { field: "location", headerName: "Location", flex: 1 },
      { field: "eqid", headerName: "Equipment Id", flex: 1 },
      { field: "machine_name", headerName: "Machine Name", flex: 1 },
      { field: "make", headerName: "Make", flex: 1 },
      { field: "model", headerName: "Model", flex: 1 },
      { field: "capacity", headerName: "Capacity", flex: 1 },
  ], [page,rowsPerPage]);


 const {
    data: maintenanceResponseall,
  } = useGetTotalMachine( keyword, 1, totalItems||99999);

const transformedAllData = useMemo(() => {
  if (!maintenanceResponseall?.machines) return [];

  return maintenanceResponseall.machines.map((item: any) => ({
    location: item?.location || "-",
    eqid: item.machine?.eqid || "-",
    machine_name: item?.machine_name || "-",
    make: item.machine?.make || "-",
    model: item.machine?.model || "-",
    capacity: item.machine?.capacity || "-",
  }));
}, [maintenanceResponseall]);



  const addComponent = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => refetch()}
        disabled={isFetching}
        className="flex items-center gap-2"
      >
        {isFetching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Refreshing...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" /> Refresh
          </>
        )}
      </Button>
    </div>
  );

const navigate = useNavigate();
  return (
    <div className="container mx-auto">
       <div className="mb-6">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
                  onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary"
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-primary">
          Total Machines
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>


      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary">
          Total Machines
        </h1>
        <p className="text-muted-foreground">Total Entries: {totalItems}</p>
      </div>


      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>Filter by date range or keyword</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium">Search Keyword</label>
              <Input
                placeholder="Enter keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Search
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Machine List</CardTitle>
          <CardDescription>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading data...
              </div>
            ) : (
              `Showing ${maintenanceData?.length || 0} of ${totalItems} entries`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            rowData={maintenanceData || []}
            colDefs={columnDefs}
            isLoading={isLoading}
            addComponent={addComponent}
            pagination={false}
            showPagination
            showActions={false}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            showFilter={false}
            onRowsPerPageChange={setRowsPerPage}
            fileName="Total_machines_Report"
            allData={() => transformedAllData} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalMachineScreen;

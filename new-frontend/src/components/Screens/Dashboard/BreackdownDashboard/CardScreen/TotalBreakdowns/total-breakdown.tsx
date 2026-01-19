

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
import { useGetTotalMaintenance } from "./hooks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";


const TotalBreakdownScreen = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [keyword, setKeyword] = useState("");

  const {
    data: maintenanceResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetTotalMaintenance(fromDate, toDate, keyword, page, rowsPerPage);

  const maintenanceData = maintenanceResponse?.content || [];
  const totalItems = maintenanceResponse?.totalElements || 0;
  const totalPages = maintenanceResponse?.totalPages || 0;



const columnDefs = useMemo(
  () => [
    {
      headerName: "Sr.No",
      cellRenderer: (params: any) =>
        (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
      width: 80,
      filter: false,
    },
    {
      headerName: "Slip Number",
      field: "bd_slip",
      flex: 1,
    },
    {
      headerName: "Machine",
      field: "machine.machine_name",
      cellRenderer: (params: any) => params.data?.machine?.machine_name || "-",
      flex: 1.2,
    },
    {
      headerName: "Breakdown Description",
      field: "observation",
      flex: 1.5,
    },
    {
      headerName: "Root Cause",
      field: "root_cause",
      flex: 1.2,
    },
    {
      headerName: "Corrective Action",
      field: "action_taken",
      flex: 1.2,
    },
    {
      headerName: "Raised By",
      field: "raisedBy",
      cellRenderer: (params: any) =>
        `${params.data?.addedBy?.firstName || ""} ${params.data?.addedBy?.lastName || ""}`.trim() || "-",
      flex: 1,
    },
    {
      headerName: "Closed By",
      field: "closedBy",
      cellRenderer: (params: any) =>
        `${params.data?.updateBy?.firstName || ""} ${params.data?.updateBy?.lastName || ""}`.trim() || "-",
      flex: 1,
    },
    {
      headerName: "Raised Date",
      field: "ticket_raised_time",
      cellRenderer: (params: any) =>
        params.data?.ticket_raised_time
          ? new Date(params.data.ticket_raised_time).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "-",
      flex: 1.1,
    },
    {
      headerName: "Trial Date",
      field: "ticket_trial_time",
      cellRenderer: (params: any) =>
        params.data?.ticket_trial_time
          ? new Date(params.data.ticket_trial_time).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "-",
      flex: 1.1,
    },
    {
      headerName: "Closed Date",
      field: "ticket_closed_time",
      cellRenderer: (params: any) =>
        params.data?.ticket_closed_time
          ? new Date(params.data.ticket_closed_time).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "-",
      flex: 1.1,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => {
        const status = params.data?.status;
        const statusMap: Record<number, { label: string; color: string }> = {
          1: { label: "Open", color: "#1E90FF" },
          2: { label: "Trial", color: "#FFD700" },
          3: { label: "Closed", color: "#32CD32" },
        };
        const display = statusMap[status] || { label: "Unknown", color: "#808080" };
        return (
          <span
            style={{
              backgroundColor: display.color,
              color: "#fff",
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "0.8rem",
            }}
          >
            {display.label}
          </span>
        );
      },
      flex: 0.8,
    },
   
  ],
  [page, rowsPerPage]
);


 const {
    data: maintenanceResponseAll
  } = useGetTotalMaintenance(fromDate, toDate, keyword, 1, 99999);


  const maintenanceDataAll = maintenanceResponseAll?.content || [];
const transformedAllData = useMemo(() => {
  if (!maintenanceDataAll) return [];

  return maintenanceDataAll.map((item: any) => {
    const statusMap: Record<number, { label: string; color: string }> = {
      1: { label: "Open", color: "#1E90FF" },
      2: { label: "Trial", color: "#FFD700" },
      3: { label: "Closed", color: "#32CD32" },
    };
    const statusObj = statusMap[item.status] || { label: "Unknown", color: "#808080" };

    return {
      bd_slip: item.bd_slip || "-",
      machine_name: item.machine?.machine_name || "-",
      observation: item.observation || "-",
      root_cause: item.root_cause || "-",
      action_taken: item.action_taken || "-",
      raisedBy: item.addedBy
        ? `${item.addedBy.firstName || ""} ${item.addedBy.lastName || ""}`.trim()
        : "-",
      closedBy: item.updateBy
        ? `${item.updateBy.firstName || ""} ${item.updateBy.lastName || ""}`.trim()
        : "-",
      ticket_raised_time: item.ticket_raised_time
        ? new Date(item.ticket_raised_time).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",
      ticket_trial_time: item.ticket_trial_time
        ? new Date(item.ticket_trial_time).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",
      ticket_closed_time: item.ticket_closed_time
        ? new Date(item.ticket_closed_time).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",
      status: statusObj.label,
      statusColor: statusObj.color,
    };
  });
}, [maintenanceDataAll]);


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
          Total Breakdown
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>

      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary">
          Total Breakdown
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
            <div className="flex flex-col">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

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
          <CardTitle>Breakdown List</CardTitle>
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
            showPagination={true}
            showActions={false}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            showFilter={false}
            onRowsPerPageChange={setRowsPerPage}
            fileName="Total_Breakdown_Report"
           allData={() => transformedAllData} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalBreakdownScreen;

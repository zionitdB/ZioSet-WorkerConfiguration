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
import { useGetTotalOverdueMaintenance } from "./hooks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const TotalTrialBreakdownScreen = () => {
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
  } = useGetTotalOverdueMaintenance(fromDate, toDate, keyword, page, rowsPerPage);

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
      cellRenderer: (params: any) => params.data?.bd_slip || "-",
    },
    {
      headerName: "Machine",
      field: "machine_name",
      flex: 1,
      cellRenderer: (params: any) => params.data?.machine?.machine_name || "-",
    },
    {
      headerName: "Breakdown Description",
      field: "observation",
      flex: 1.4,
      cellRenderer: (params: any) => params.data?.observation || "-",
    },
    {
      headerName: "Root Cause",
      field: "root_cause",
      flex: 1.2,
      cellRenderer: (params: any) => params.data?.root_cause || "-",
    },
    {
      headerName: "Corrective Action",
      field: "action_taken",
      flex: 1.2,
      cellRenderer: (params: any) => params.data?.action_taken || "-",
    },
    {
      headerName: "Raised By",
      field: "raisedBy",
      flex: 1,
      cellRenderer: (params: any) => {
        const firstName = params.data?.addedBy?.firstName || "";
        const lastName = params.data?.addedBy?.lastName || "";
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";
      },
    },
    {
      headerName: "Closed By",
      field: "closedBy",
      flex: 1,
      cellRenderer: (params: any) => {
        const firstName = params.data?.updateBy?.firstName || "";
        const lastName = params.data?.updateBy?.lastName || "";
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : "-";
      },
    },
    {
      headerName: "Raised Date",
      field: "ticket_raised_time",
      flex: 1.1,
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
    },
    {
      headerName: "Trial Date",
      field: "ticket_trial_time",
      flex: 1.1,
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
    },
    {
      headerName: "Closed Date",
      field: "ticket_closed_time",
      flex: 1.1,
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
    },
    {
      headerName: "Status",
      field: "status",
      flex: 0.8,
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
    },
  ],
  [page, rowsPerPage]
);



 const {
    data: maintenanceResponseAll,
  } = useGetTotalOverdueMaintenance(fromDate, toDate, keyword, 1, totalItems||99999);

  const maintenanceDataAll = maintenanceResponseAll?.content || [];


const transformedAllData = useMemo(() => {
  if (!maintenanceDataAll) return [];

  return maintenanceDataAll?.map((item: any) => ({
    "Slip Number": item.bd_slip || "-",
    "Machine": item.machine?.machine_name || "-",
    "Breakdown Description": item.observation || "-",
    "Root Cause": item.root_cause || "-",
    "Corrective Action": item.action_taken || "-",
    "Raised By": item.addedBy
      ? `${item.addedBy.firstName || ""} ${item.addedBy.lastName || ""}`.trim()
      : "-",
    "Closed By": item.updateBy
      ? `${item.updateBy.firstName || ""} ${item.updateBy.lastName || ""}`.trim()
      : "-",
    "Raised Date": item.ticket_raised_time
      ? new Date(item.ticket_raised_time).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "-",
    "Trial Date": item.ticket_trial_time
      ? new Date(item.ticket_trial_time).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "-",
    "Closed Date": item.ticket_closed_time
      ? new Date(item.ticket_closed_time).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "-",
    "Status": (() => {
      const statusMap: Record<number, string> = {
        1: "Open",
        2: "Trial",
        3: "Closed",
      };
      return statusMap[item.status] || "Unknown";
    })(),
  }));
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
          Total Trial Breakdown
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>


      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary">
          Total Trial Breakdown
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
            fileName="Trial_Breakdown_Report"
         allData={() => transformedAllData} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalTrialBreakdownScreen;

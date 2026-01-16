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
import { useGetTotalApproveMaintenance } from "./hooks";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import CustomModal from "@/components/common/Modal/DialogModal";
import BreakdownPDF from "./export-pdf";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";


const TotalClosedBreakDownScreen = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [keyword, setKeyword] = useState("");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<any>(null);

  const {
    data: maintenanceResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetTotalApproveMaintenance(fromDate, toDate, keyword, page, rowsPerPage);

  const maintenanceData = maintenanceResponse?.content || [];
  const totalItems = maintenanceResponse?.totalElements || 0;
  const totalPages = maintenanceResponse?.totalPages || 0;

  // const handleSearch = () => {
  //   setPage(1);
  //   refetch();
  // };

  const handlePreview = (row: any) => {
    setViewRow(row);
    setIsViewOpen(true);
  };

  const handleDownloadPDF = async () => {
    if (!viewRow) return;

    const blob = await pdf(<BreakdownPDF data={viewRow} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Breakdown_Report.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

const columnDefs = useMemo(
  () => [
    {
      headerName: "Sr.No",
      cellRenderer: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
      width: 80,
    },
    {
      headerName: "Slip Number",
      field: "bd_slip",
      flex: 1,
    },
    {
      headerName: "Machine",
      field: "machine_name",
      cellRenderer: (params: any) => params.data?.machine?.machine_name || "-",
      flex: 1.2,
    },
    {
      headerName: "Description of Breakdown",
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
      headerName: "Raised Date",
      field: "ticket_raised_time",
      cellRenderer: (params: any) =>
        params.data?.ticket_raised_time
          ? new Date(params.data.ticket_raised_time).toLocaleString()
          : "-",
      flex: 1.1,
    },
    {
      headerName: "Closed Date",
      field: "ticket_closed_time",
      cellRenderer: (params: any) =>
        params.data?.ticket_closed_time
          ? new Date(params.data.ticket_closed_time).toLocaleString()
          : "-",
      flex: 1.1,
    },
    {
      headerName: "Closed By",
      field: "updateBy",
      cellRenderer: (params: any) =>
        `${params.data?.updateBy?.firstName || ""} ${params.data?.updateBy?.lastName || ""}`.trim() || "-",
      flex: 1,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => {
        const statusMap: Record<number, string> = {
          1: "Open",
          2: "Trial",
          3: "Closed",
        };
        const status = params.data?.status;
        return typeof status === "number" ? statusMap[status] ?? "-" : "-";
      },
      flex: 0.8,
    },
    {
      headerName: "Action",
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handlePreview(params.data)}>
            Preview & Download
          </Button>
        </div>
      ),
      flex: 1,
    },
  ],
  [page, rowsPerPage]
);


const statusMap: Record<number, string> = {
  1: "Open",
  2: "Trial",
  3: "Closed",
};

  const {
    data: maintenanceResponseAll
  } = useGetTotalApproveMaintenance(fromDate, toDate, keyword, 1, totalItems||99999);

  const maintenanceDataAll = maintenanceResponseAll?.content || [];

const transformedAllData = useMemo(() => {
  if (!maintenanceDataAll) return [];

  return maintenanceDataAll?.map((item: any) => ({
    bd_slip: item.bd_slip || "-",
    machine_name: item.machine?.machine_name || "-",
    observation: item.observation || "-",
    root_cause: item.root_cause || "-",
    action_taken: item.action_taken || "-",
    ticket_raised_time: item.ticket_raised_time
      ? new Date(item.ticket_raised_time).toLocaleString()
      : "-",
    ticket_closed_time: item.ticket_closed_time
      ? new Date(item.ticket_closed_time).toLocaleString()
      : "-",
    updateBy: item.updateBy
      ? `${item.updateBy.firstName || ""} ${item.updateBy.lastName || ""}`.trim()
      : "-",
     status: typeof item.status === "number" ? statusMap[item.status] ?? "-" : "-",
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
          Total Closed Breakdown
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>

      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Total Closed Breakdown</h1>
        <p className="text-muted-foreground">Total Entries: {totalItems}</p>
      </div>

      {/* Filter Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>Filter by date range or keyword</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-medium">From Date</label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">To Date</label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
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

      {/* Table Card */}
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
            fileName="Total_Closed_Breakdown_Report"
           allData={() => transformedAllData} 
          />
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <CustomModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dialogTitle="View Breakdown PDF"
        dialogDescription="View and Download Breakdown PDF"
        width="max-w-5xl"
        showCloseButton={false}
      >
        {viewRow ? (
          <div className="space-y-4">
            <PDFViewer width="100%" height={1000}     className="w-full  border rounded-md">
              <BreakdownPDF data={viewRow} />
            </PDFViewer>

            <div className="fixed bottom-0 left-0 right-0 px-6 py-3 flex justify-end gap-3 shadow-md ">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
              <Button onClick={handleDownloadPDF} className="bg-primary text-white">
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">No data to preview.</p>
        )}
      </CustomModal>
    </div>
  );
};

export default TotalClosedBreakDownScreen;

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import { Loader2 } from "lucide-react";
import { useGet52WeekBreakdown } from "../../hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";



export default function MachineBreakdownList() {
  
// Helper functions
function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff =
    now.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
  const oneWeek = 604800000; // ms in one week
  return Math.ceil(diff / oneWeek);
}

function getWeekDateRange(year: number, weekNo: number) {
  const jan1 = new Date(year, 0, 1);
  const daysOffset = (weekNo - 1) * 7;
  const startDate = new Date(jan1.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  // Adjust to Monday
  const day = startDate.getDay(); // Sunday = 0
  const diffToMonday = day === 0 ? -6 : 1 - day;
  startDate.setDate(startDate.getDate() + diffToMonday);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  return { start: format(startDate), end: format(endDate) };
}

function getWeeksOfYear() {
  const weeks = [];
  const year = new Date().getFullYear();
  for (let i = 1; i <= 52; i++) {
    const { start, end } = getWeekDateRange(year, i);
    weeks.push({ weekNo: i, label: `Week ${i} (${start} → ${end})` });
  }
  return weeks;
}

 const currentWeek = getCurrentWeekNumber();
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const { data, isLoading } = useGet52WeekBreakdown(selectedWeek);
  const maintenanceData = Array.isArray(data) ? data : [];

  const totalItems = maintenanceData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedData = maintenanceData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr.No",
        cellRenderer: (params: any) =>
          (page - 1) * rowsPerPage + params.node.rowIndex + 1,
        width: 90,
      },
      {
        headerName: "Machine Name",
        field: "machineName",
        flex: 1.5,
      },
      {
        headerName: "Open Data",
        cellRenderer: (params: any) => params.data.weekDatas?.[0]?.open ?? 0,
        flex: 1,
        cellStyle: { color: "#1E90FF", fontWeight: "bold" },
      },
         {
        headerName: "Trial Data",
        cellRenderer: (params: any) => params.data.weekDatas?.[0]?.trial ?? 0,
        flex: 1,
        cellStyle: { color: "#FFD700", fontWeight: "bold" },
      },
      {
        headerName: "Closed Data",
        cellRenderer: (params: any) => params.data.weekDatas?.[0]?.closed ?? 0,
        flex: 1,
        cellStyle: { color: "#32CD32", fontWeight: "bold" },
      },
    ],
    [page, rowsPerPage]
  );

  const weeks = getWeeksOfYear();

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
          Machine List
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Machine List
        </h1>
        <p className="text-muted-foreground text-sm">
          Weekly summary by machine.
        </p>
      </div>

      {/* Week Selector */}
      <div className="flex justify-center items-center gap-3 mb-4">
       <div className="flex justify-center mb-4 mt-2 gap-2 items-center">
  <span className="text-sm font-medium text-muted-foreground">Select Week:</span>

  <Select value={String(selectedWeek)} onValueChange={(val) => setSelectedWeek(Number(val))}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Select Week" />
    </SelectTrigger>
    <SelectContent>
      {weeks.map((w) => (
        <SelectItem key={w.weekNo} value={String(w.weekNo)}>
          {w.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Data (Week {selectedWeek})</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading machine data..."
              : `Showing ${(page - 1) * rowsPerPage + 1}–${Math.min(
                  page * rowsPerPage,
                  totalItems
                )} of ${totalItems}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground text-sm">
                Loading data...
              </span>
            </div>
          ) : totalItems === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              No machine data found for this week.
            </p>
          ) : (
            <DataTable
              rowData={paginatedData}
              colDefs={columnDefs}
              isLoading={isLoading}
              pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              showEdit={false}
              showDelete={false}
              showFilter={false}
              showExportButton={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

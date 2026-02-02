import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChartColumn } from "react-icons/fa6";
import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
import { useTheme } from "next-themes";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeAlpine,
} from "ag-grid-community";
import CustomPagination from "./CustomPagination";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, FileDown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
  rowData: any[];
  colDefs: any[];
  isLoading: boolean;
  onAddClick?: () => void;
  addLabel?: string;
  addComponent?: React.ReactNode;
  onEditClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  actionComponents?: any;
  showEdit?: boolean;
  showDelete?: boolean;
  showCheckbox?: boolean;
  checkboxPosition?: number;
  onRowSelection?: any;
  showExportButton?: boolean;
  showHideColumns?: boolean;
  showActions?: boolean;
  page?: any;
  totalPages?: any;
  setPage?: any;
  rowsPerPage?: any;
  onRowsPerPageChange: any;
  pagination?: boolean;
  showPagination?: boolean;
  showRowsPerPage?: boolean;
  showFilter?: boolean;
  onFilterChange?: (filterModel: any) => void;
  allData?: () => Promise<any[]>;
  fileName?: string;
  handleCustomExportWithColumns?: () => void;
  selectedRows?: any[];
  rowIdField?: string;
}

// const lightTheme = themeAlpine.withParams({
//   backgroundColor: "hsl(var(--background))",
//   foregroundColor: "hsl(var(--foreground))",
//   headerBackgroundColor: "hsl(var(--muted))",
//   headerTextColor: "hsl(var(--muted-foreground))",
//   oddRowBackgroundColor: "transparent", // IMPORTANT
//   borderColor: "transparent",
//   headerColumnResizeHandleColor: "hsl(var(--border))",
//   fontSize: "14px",
//   rowBorder: false,
//   headerFontWeight: 600,
//   cellHorizontalPadding: 16,
// });

// const darkTheme = lightTheme;

// const lightTheme = themeAlpine.withParams({
//   backgroundColor: "var(--background)",
//   foregroundColor: "var(--foreground)",
//   headerTextColor: "var(--foreground)",
//   headerBackgroundColor: "var(--muted)",
//   oddRowBackgroundColor: "var(--muted/50)",
//   headerColumnResizeHandleColor: "var(--muted-foreground)",
//   fontSize: "14px",
//   borderColor: "var(--border)",
//   rowBorder: true,

//   headerFontWeight: 600,
// });

// const darkTheme = themeAlpine.withParams({
//   backgroundColor: "var(--background)",
//   foregroundColor: "var(--foreground)",
//   headerTextColor: "var(--foreground)",
//   headerBackgroundColor: "var(--muted)",
//   oddRowBackgroundColor: "var(--muted/50)",
//   headerColumnResizeHandleColor: "var(--muted-foreground)",
//   fontSize: "14px",
//   borderColor: "var(--border)",
//   rowBorder: true,
//   headerFontWeight: 600,
// });

const lightTheme = themeAlpine.withParams({
  backgroundColor: "var(--background)",
  foregroundColor: "var(--foreground)",
  headerTextColor: "var(--foreground)",
  headerBackgroundColor: "var(--muted)",
  oddRowBackgroundColor: "var(--muted-muted)",
  headerColumnResizeHandleColor: "var(--muted-foreground)",
  fontSize: "15px",
});

const darkTheme = themeAlpine.withParams({
  backgroundColor: "var(--background)",
  foregroundColor: "var(--foreground)",
  headerTextColor: "var(--muted-foreground)",
  headerBackgroundColor: "var(--muted)",
  oddRowBackgroundColor: "var(--muted-muted)",
  headerColumnResizeHandleColor: "var(--muted-foreground)",
  fontSize: "15px",
});

const DataTable: React.FC<DataTableProps> = ({
  rowData,
  colDefs,
  isLoading,
  onAddClick,
  addLabel = "Add New",
  addComponent,
  onEditClick,
  onDeleteClick,
  actionComponents = [],
  showEdit = true,
  showDelete = true,
  showCheckbox = false,
  checkboxPosition = 0,
  showExportButton = true,
  showHideColumns = true,
  showActions = true,
  onRowSelection,
  page,
  totalPages,
  setPage,
  rowsPerPage = 10,
  onRowsPerPageChange,
  pagination = false,
  showPagination = false,
  showRowsPerPage = true,
  showFilter = true,
  onFilterChange,
  allData,
  fileName,
  handleCustomExportWithColumns,
  selectedRows = [],
  rowIdField = "serialNo",
}) => {
  const { theme } = useTheme();
  const gridRef = useRef<AgGridReact<any>>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(colDefs.map((col) => col.field)),
  );
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");

  const exportCancelledRef = useRef(false);

  const cancelExport = () => {
    exportCancelledRef.current = true;
    setIsExporting(false);
    setExportProgress(0);
    setExportStatus("");
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-ag-theme-mode", "dark");
    } else {
      root.setAttribute("data-ag-theme-mode", "light");
    }
  }, [theme]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
      floatingFilter: showFilter ? isFilterEnabled : false,
    }),
    [isFilterEnabled, showFilter],
  );

  useEffect(() => {
    if (gridRef.current?.api && rowData) {
      // Grid update logic
    }
  }, [rowData]);

  const checkboxColumn = showCheckbox
    ? {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        width: 50,
        headerName: "",
        filter: false,
      }
    : null;

  const ActionCellRenderer: React.FC<any> = (params) => {
    if (!params?.data) return null;

    return (
      <div className="flex items-center justify-center h-full w-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent"
            >
              <MdMoreVert className="text-lg" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {showEdit && (
              <DropdownMenuItem
                onClick={() => onEditClick?.(params.data)}
                className="cursor-pointer"
              >
                <FaEdit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
            )}
            {showDelete && (
              <DropdownMenuItem
                onClick={() => onDeleteClick?.(params.data)}
                className="text-destructive cursor-pointer focus:text-destructive"
              >
                <FaTrash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            )}
            {actionComponents.map((Component: any, index: number) => (
              <DropdownMenuItem key={index} className="cursor-pointer">
                <Component rowData={params.data} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const actionColumn: any = {
    headerName: "Actions",
    field: "actions",
    cellRenderer: ActionCellRenderer,
    minWidth: 100,
    maxWidth: 120,
    flex: 0,
    filter: false,
    sortable: false,
  };

  const extendedColDefs = useMemo(() => {
    let columns = [...colDefs];
    const visibleColumns = columns.filter((col) => selectedKeys.has(col.field));

    if (showCheckbox && checkboxColumn) {
      visibleColumns.splice(checkboxPosition, 0, checkboxColumn);
    }
    if (showActions) {
      visibleColumns.push(actionColumn);
    }

    return visibleColumns;
  }, [
    colDefs,
    showCheckbox,
    checkboxColumn,
    selectedKeys,
    showActions,
    checkboxPosition,
  ]);

  const toggleSelection = (field: string, checked: boolean) => {
    setSelectedKeys((prevKeys) => {
      const newKeys = new Set(prevKeys);
      if (checked) {
        newKeys.add(field);
      } else {
        newKeys.delete(field);
      }
      return newKeys;
    });
  };

  const applySelection = useCallback(() => {
    if (gridRef.current?.api && selectedRows.length > 0) {
      gridRef.current.api.forEachNode((node) => {
        const isSelected = selectedRows.some(
          (item) => item[rowIdField] === node.data?.[rowIdField],
        );
        node.setSelected(isSelected, false);
      });
    }
  }, [selectedRows, rowIdField]);


  useEffect(() => {
    if (!isLoading) {
      applySelection();
    }
  }, [rowData, isLoading, applySelection]);


  
  const handleSelectionChanged = () => {
    if (gridRef.current) {
      const selectedNodes = gridRef.current.api.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      onRowSelection?.(selectedData);
    }
  };

  const handleDefaultExportWithColumns = async () => {
    exportCancelledRef.current = false;

    setIsExporting(true);
    setExportProgress(0);
    setExportStatus("Preparing export...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setExportProgress(20);

      if (!gridRef.current?.api) return;

      const selectedColumns = colDefs.filter(
        (col) =>
          col.field && selectedKeys.has(col.field) && col.field !== "actions",
      );

      setExportStatus("Collecting data...");
      await new Promise((resolve) => setTimeout(resolve, 400));
      setExportProgress(40);

      let exportData: any[] = [];
      if (typeof allData === "function") {
        exportData = await allData();
      } else {
        gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
          exportData.push(node.data);
        });
      }

      setExportStatus("Processing rows...");
      await new Promise((resolve) => setTimeout(resolve, 400));
      setExportProgress(60);

      const MAX_CELL_LENGTH = 32767;

      const getColumnValue = (col: any, row: any, index: number) => {
        let value: any;

        if (col.valueGetter) {
          try {
            value = col.valueGetter({
              data: row,
              node: { rowIndex: index },
              colDef: col,
            });
          } catch {
            value = "-";
          }
        } else if (col.field) {
          const path = col.field.split(".");
          value = path.reduce(
            (acc: any, key: string) =>
              acc && acc[key] !== undefined ? acc[key] : "-",
            row,
          );
        }

        if (typeof value === "string" && !isNaN(Date.parse(value))) {
          value = new Date(value).toLocaleString();
        }

        if (typeof value === "string" && value.length > MAX_CELL_LENGTH) {
          value = value.slice(0, MAX_CELL_LENGTH - 3) + "...";
        }

        return value ?? "-";
      };

      const exportRows = exportData.map((row, index) => {
        const rowObj: Record<string, any> = { "Sr No": index + 1 };
        selectedColumns.forEach((col) => {
          rowObj[col.headerName || col.field] = getColumnValue(col, row, index);
        });
        return rowObj;
      });

      setExportStatus("Creating Excel file...");
      await new Promise((resolve) => setTimeout(resolve, 400));
      setExportProgress(80);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportRows);
      XLSX.utils.book_append_sheet(wb, ws, "Exported Data");

      setExportStatus("Downloading file...");
      setExportProgress(95);
      await new Promise((resolve) => setTimeout(resolve, 300));

      XLSX.writeFile(wb, fileName ? `${fileName}.xlsx` : "exported_data.xlsx");

      setExportProgress(100);
      setExportStatus("Export completed!");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsExporting(false);
      setExportProgress(0);
      setExportStatus("");
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("Export failed!");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    (handleCustomExportWithColumns ?? handleDefaultExportWithColumns)();
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState(
    new Set([`${rowsPerPage}`]),
  );

  const selectedValue = useMemo(() => {
    return `${Array.from(selectedRowKeys)[0]} Rows`;
  }, [selectedRowKeys]);

  const onGridReady = () => {};

  const updateFilterValues = useCallback(() => {
    if (gridRef.current?.api) {
      const filterModel = gridRef.current.api.getFilterModel();
      onFilterChange?.(filterModel);
    }
  }, [onFilterChange]);

  const FancyLoader = () => (
    <div className="flex items-center gap-3">
      <div className="relative h-5 w-5">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        Processing...
      </span>
    </div>
  );


  return (
    <>
      <div
        className={` overflow-hidden ${
          theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        } w-full h-150 flex flex-col`}
      >
        {/* Header Section */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-3">
              {onAddClick && (
                <Button
                  variant="default"
                  onClick={onAddClick}
                  className="shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-shadow"
                >
                  <MdAddCircleOutline className="mr-2 h-4 w-4" />
                  {addLabel}
                </Button>
              )}
              {addComponent && <div>{addComponent}</div>}
            </div>

            <div className="flex gap-2 items-center">
              {showFilter && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background/50">
                  <span className="text-sm text-muted-foreground font-medium">
                    Filter
                  </span>
                  <Switch
                    checked={isFilterEnabled}
                    onCheckedChange={(val) => setIsFilterEnabled(val)}
                    className="scale-90"
                  />
                </div>
              )}

              {showExportButton && (
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="shadow-sm"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                  )}
                  Export
                </Button>
              )}

              {showHideColumns && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shadow-sm">
                      <FaChartColumn className="mr-2 h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {colDefs.map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.field}
                        checked={selectedKeys.has(col.field)}
                        onCheckedChange={(checked: boolean) =>
                          toggleSelection(col.field, checked)
                        }
                      >
                        {col.headerName}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {showRowsPerPage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="capitalize shadow-sm">
                      {selectedValue}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>Rows per Page</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {[5, 10, 20, 50].map((rows) => (
                        <DropdownMenuItem
                          key={rows}
                          onClick={() => {
                            setSelectedRowKeys(new Set([`${rows}`]));
                            onRowsPerPageChange(rows);
                          }}
                        >
                          {rows} Rows
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Loading data...
                </p>
              </div>
            </div>
          )}

          <AgGridReact
            theme={theme === "dark" ? darkTheme : lightTheme}
            ref={gridRef}
            rowHeight={64}
            rowData={rowData}
            loading={false}
            columnDefs={extendedColDefs}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            pagination={pagination}
            paginationPageSize={10}
            onSelectionChanged={handleSelectionChanged}
            paginationPageSizeSelector={[10, 20, 30, 40, 50, 60]}
            onGridReady={onGridReady}
            onFilterChanged={updateFilterValues}
            ensureDomOrder={true}
            enableCellTextSelection={true}
            // getRowId={(params) => params.data[rowIdField]}
          />
        </div>

        {/* Footer/Pagination Section */}
        {showPagination && (
          <div className="bg-card border-t border-border px-6 py-3">
            <CustomPagination
              current={page}
              total={totalPages}
              onPageChange={setPage}
              showControls={true}
              isCompact={true}
            />
          </div>
        )}
      </div>

      {/* Export Progress Modal */}
      <Dialog
        open={isExporting}
        onOpenChange={(open) => {
          if (!open) cancelExport();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5 text-primary" />
              Exporting Data
            </DialogTitle>
            <DialogDescription>
              Please wait while we prepare your Excel file...
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{exportStatus}</span>
                <span className="font-semibold text-foreground">
                  {exportProgress}%
                </span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {exportProgress < 100 ? (
                <>
                  <FancyLoader />
                  {/* <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span> */}
                </>
              ) : (
                <>
                  <div className="relative">
                    <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in-50 duration-300" />
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                      File is Ready!
                    </h3>
                    <p className="text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100">
                      Your Excel file has been downloaded successfully.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTable;

































// import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { FaChartColumn } from "react-icons/fa6";
// import { MdAddCircleOutline, MdMoreVert } from "react-icons/md";
// import { useTheme } from "next-themes";
// import * as XLSX from "xlsx";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
//   ModuleRegistry,
//   AllCommunityModule,
//   themeAlpine,
// } from "ag-grid-community";
// import CustomPagination from "./CustomPagination";
// import { Switch } from "@/components/ui/switch";
// import { CheckCircle2, FileDown, Loader2, Filter } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Progress } from "@/components/ui/progress";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";

// // Enhanced Table Skeleton Component
// const TableSkeleton = ({ columns = 5, rows = 8 }) => (
//   <div className="w-full">
//     <Table>
//       <TableHeader>
//         <TableRow className="hover:bg-transparent border-b">
//           {Array.from({ length: columns }).map((_, i) => (
//             <TableHead key={i} className="h-12 bg-muted/50">
//               <Skeleton className="h-4 w-full max-w-[120px]" />
//             </TableHead>
//           ))}
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Array.from({ length: rows }).map((_, rowIndex) => (
//           <TableRow key={rowIndex} className="hover:bg-transparent">
//             {Array.from({ length: columns }).map((_, colIndex) => (
//               <TableCell key={colIndex} className="h-14">
//                 <Skeleton className="h-4 w-full" />
//               </TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// );

// ModuleRegistry.registerModules([AllCommunityModule]);

// interface DataTableProps {
//   rowData: any[];
//   colDefs: any[];
//   isLoading: boolean;
//   onAddClick?: () => void;
//   addLabel?: string;
//   addComponent?: React.ReactNode;
//   onEditClick?: (data: any) => void;
//   onDeleteClick?: (data: any) => void;
//   actionComponents?: any;
//   showEdit?: boolean;
//   showDelete?: boolean;
//   showCheckbox?: boolean;
//   checkboxPosition?: number;
//   onRowSelection?: any;
//   showExportButton?: boolean;
//   showHideColumns?: boolean;
//   showActions?: boolean;
//   page?: any;
//   totalPages?: any;
//   setPage?: any;
//   rowsPerPage?: any;
//   onRowsPerPageChange: any;
//   pagination?: boolean;
//   showPagination?: boolean;
//   showRowsPerPage?: boolean;
//   showFilter?: boolean;
//   onFilterChange?: (filterModel: any) => void;
//   allData?: () => Promise<any[]>;
//   fileName?: string;
//   handleCustomExportWithColumns?: () => void;
// }

// const lightTheme = themeAlpine.withParams({
//   backgroundColor: "var(--background)",
//   foregroundColor: "var(--foreground)",
//   headerTextColor: "var(--foreground)",
//   headerBackgroundColor: "var(--muted)",
//   oddRowBackgroundColor: "transparent",
//   headerColumnResizeHandleColor: "var(--muted-foreground)",
//   fontSize: "14px",
//   borderColor: "var(--border)",
//   rowBorder: true,
//   headerFontWeight: 600,
// });

// const darkTheme = themeAlpine.withParams({
//   backgroundColor: "var(--background)",
//   foregroundColor: "var(--foreground)",
//   headerTextColor: "var(--foreground)",
//   headerBackgroundColor: "var(--muted)",
//   oddRowBackgroundColor: "transparent",
//   headerColumnResizeHandleColor: "var(--muted-foreground)",
//   fontSize: "14px",
//   borderColor: "var(--border)",
//   rowBorder: true,
//   headerFontWeight: 600,
// });

// const DataTable: React.FC<DataTableProps> = ({
//   rowData,
//   colDefs,
//   isLoading,
//   onAddClick,
//   addLabel = "Add New",
//   addComponent,
//   onEditClick,
//   onDeleteClick,
//   actionComponents = [],
//   showEdit = true,
//   showDelete = true,
//   showCheckbox = false,
//   checkboxPosition = 0,
//   showExportButton = true,
//   showHideColumns = true,
//   showActions = true,
//   onRowSelection,
//   page,
//   totalPages,
//   setPage,
//   rowsPerPage = 10,
//   onRowsPerPageChange,
//   pagination = false,
//   showPagination = false,
//   showRowsPerPage = true,
//   showFilter = true,
//   onFilterChange,
//   allData,
//   fileName,
//   handleCustomExportWithColumns,
// }) => {
//   const { theme } = useTheme();
//   const gridRef = useRef<AgGridReact<any>>(null);
//   const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
//     new Set(colDefs.map((col) => col.field))
//   );
//   const [isFilterEnabled, setIsFilterEnabled] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [exportStatus, setExportStatus] = useState("");
//   const exportCancelledRef = useRef(false);

//   const cancelExport = () => {
//     exportCancelledRef.current = true;
//     setIsExporting(false);
//     setExportProgress(0);
//     setExportStatus("");
//   };

//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") {
//       root.setAttribute("data-ag-theme-mode", "dark");
//     } else {
//       root.setAttribute("data-ag-theme-mode", "light");
//     }
//   }, [theme]);

//   const defaultColDef = useMemo(
//     () => ({
//       sortable: true,
//       filter: true,
//       resizable: true,
//       minWidth: 100,
//       flex: 1,
//       floatingFilter: showFilter ? isFilterEnabled : false,
//     }),
//     [isFilterEnabled, showFilter]
//   );

//   const checkboxColumn = showCheckbox
//     ? {
//         headerCheckboxSelection: true,
//         checkboxSelection: true,
//         headerCheckboxSelectionFilteredOnly: true,
//         width: 50,
//         headerName: "",
//         filter: false,
//       }
//     : null;

//   const ActionCellRenderer: React.FC<any> = (params) => {
//     if (!params?.data) return null;

//     return (
//       <div className="flex items-center justify-center h-full w-full">
//         <DropdownMenu modal={false}>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
//               <MdMoreVert className="text-lg" />
//             </Button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent align="end" className="w-48">
//             {showEdit && (
//               <DropdownMenuItem onClick={() => onEditClick?.(params.data)} className="cursor-pointer">
//                 <FaEdit className="mr-2 h-4 w-4" /> Edit
//               </DropdownMenuItem>
//             )}
//             {showDelete && (
//               <DropdownMenuItem
//                 onClick={() => onDeleteClick?.(params.data)}
//                 className="text-destructive cursor-pointer focus:text-destructive"
//               >
//                 <FaTrash className="mr-2 h-4 w-4" /> Delete
//               </DropdownMenuItem>
//             )}
//             {actionComponents.map((Component: any, index: number) => (
//               <DropdownMenuItem key={index} className="cursor-pointer">
//                 <Component rowData={params.data} />
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     );
//   };

//   const actionColumn: any = {
//     headerName: "Actions",
//     field: "actions",
//     cellRenderer: ActionCellRenderer,
//     minWidth: 100,
//     maxWidth: 120,
//     flex: 0,
//     filter: false,
//     sortable: false,
//   };

//   const extendedColDefs = useMemo(() => {
//     let columns = [...colDefs];
//     const visibleColumns = columns.filter((col) => selectedKeys.has(col.field));

//     if (showCheckbox && checkboxColumn) {
//       visibleColumns.splice(checkboxPosition, 0, checkboxColumn);
//     }
//     if (showActions) {
//       visibleColumns.push(actionColumn);
//     }

//     return visibleColumns;
//   }, [colDefs, showCheckbox, checkboxColumn, selectedKeys, showActions, checkboxPosition]);

//   const toggleSelection = (field: string, checked: boolean) => {
//     setSelectedKeys((prevKeys) => {
//       const newKeys = new Set(prevKeys);
//       if (checked) {
//         newKeys.add(field);
//       } else {
//         newKeys.delete(field);
//       }
//       return newKeys;
//     });
//   };

//   const handleSelectionChanged = () => {
//     if (gridRef.current) {
//       const selectedNodes = gridRef.current.api.getSelectedNodes();
//       const selectedData = selectedNodes.map((node) => node.data);
//       onRowSelection?.(selectedData);
//     }
//   };

//   const handleDefaultExportWithColumns = async () => {
//     exportCancelledRef.current = false;
//     setIsExporting(true);
//     setExportProgress(0);
//     setExportStatus("Preparing export...");

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 300));
//       setExportProgress(20);

//       if (!gridRef.current?.api) return;

//       const selectedColumns = colDefs.filter(
//         (col) => col.field && selectedKeys.has(col.field) && col.field !== "actions"
//       );

//       setExportStatus("Collecting data...");
//       await new Promise((resolve) => setTimeout(resolve, 400));
//       setExportProgress(40);

//       let exportData: any[] = [];
//       if (typeof allData === "function") {
//         exportData = await allData();
//       } else {
//         gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
//           exportData.push(node.data);
//         });
//       }

//       setExportStatus("Processing rows...");
//       await new Promise((resolve) => setTimeout(resolve, 400));
//       setExportProgress(60);

//       const MAX_CELL_LENGTH = 32767;

//       const getColumnValue = (col: any, row: any, index: number) => {
//         let value: any;

//         if (col.valueGetter) {
//           try {
//             value = col.valueGetter({ data: row, node: { rowIndex: index }, colDef: col });
//           } catch {
//             value = "-";
//           }
//         } else if (col.field) {
//           const path = col.field.split(".");
//           value = path.reduce(
//             (acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : "-"),
//             row
//           );
//         }

//         if (typeof value === "string" && !isNaN(Date.parse(value))) {
//           value = new Date(value).toLocaleString();
//         }

//         if (typeof value === "string" && value.length > MAX_CELL_LENGTH) {
//           value = value.slice(0, MAX_CELL_LENGTH - 3) + "...";
//         }

//         return value ?? "-";
//       };

//       const exportRows = exportData.map((row, index) => {
//         const rowObj: Record<string, any> = { "Sr No": index + 1 };
//         selectedColumns.forEach((col) => {
//           rowObj[col.headerName || col.field] = getColumnValue(col, row, index);
//         });
//         return rowObj;
//       });

//       setExportStatus("Creating Excel file...");
//       await new Promise((resolve) => setTimeout(resolve, 400));
//       setExportProgress(80);

//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(exportRows);
//       XLSX.utils.book_append_sheet(wb, ws, "Exported Data");

//       setExportStatus("Downloading file...");
//       setExportProgress(95);
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       XLSX.writeFile(wb, fileName ? `${fileName}.xlsx` : "exported_data.xlsx");

//       setExportProgress(100);
//       setExportStatus("Export completed!");
//       await new Promise((resolve) => setTimeout(resolve, 800));

//       setIsExporting(false);
//       setExportProgress(0);
//       setExportStatus("");
//     } catch (error) {
//       console.error("Export error:", error);
//       setExportStatus("Export failed!");
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       setIsExporting(false);
//     }
//   };

//   const handleExport = () => {
//     (handleCustomExportWithColumns ?? handleDefaultExportWithColumns)();
//   };

//   const [selectedRowKeys, setSelectedRowKeys] = useState(new Set([`${rowsPerPage}`]));

//   const selectedValue = useMemo(() => {
//     return `${Array.from(selectedRowKeys)[0]} Rows`;
//   }, [selectedRowKeys]);

//   const onGridReady = () => {};

//   const updateFilterValues = useCallback(() => {
//     if (gridRef.current?.api) {
//       const filterModel = gridRef.current.api.getFilterModel();
//       onFilterChange?.(filterModel);
//     }
//   }, [onFilterChange]);

//   const FancyLoader = () => (
//     <div className="flex items-center gap-3">
//       <div className="relative h-5 w-5">
//         <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
//         <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
//       </div>
//       <span className="text-sm font-medium text-muted-foreground">Processing...</span>
//     </div>
//   );

//   return (
//     <>
//       <div className="w-full h-auto space-y-4">
//         {/* Header Section - Clean and Modern */}
//         <div className="flex items-center justify-between">
//           <div className="flex gap-3">
//             {onAddClick && (
//               <Button
//                 variant="default"
//                 onClick={onAddClick}
//                 className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
//               >
//                 <MdAddCircleOutline className="mr-2 h-4 w-4" />
//                 {addLabel}
//               </Button>
//             )}
//             {addComponent && <div>{addComponent}</div>}
//           </div>

//           <div className="flex gap-2 items-center">
//             {showFilter && (
//               <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors">
//                 <Filter className="h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm text-muted-foreground font-medium">Filter</span>
//                 <Switch
//                   checked={isFilterEnabled}
//                   onCheckedChange={(val) => setIsFilterEnabled(val)}
//                   className="scale-90"
//                 />
//               </div>
//             )}

//             {showExportButton && (
//               <Button
//                 onClick={handleExport}
//                 variant="outline"
//                 className="shadow-sm hover:shadow-md transition-shadow"
//                 disabled={isExporting}
//               >
//                 {isExporting ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <FileDown className="mr-2 h-4 w-4" />
//                 )}
//                 Export
//               </Button>
//             )}

//             {showHideColumns && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
//                     <FaChartColumn className="mr-2 h-4 w-4" />
//                     Columns
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {colDefs.map((col) => (
//                     <DropdownMenuCheckboxItem
//                       key={col.field}
//                       checked={selectedKeys.has(col.field)}
//                       onCheckedChange={(checked: boolean) => toggleSelection(col.field, checked)}
//                     >
//                       {col.headerName}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}

//             {showRowsPerPage && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="capitalize shadow-sm hover:shadow-md transition-shadow">
//                     {selectedValue}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-48" align="end">
//                   <DropdownMenuLabel>Rows per Page</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuGroup>
//                     {[5, 10, 20, 50].map((rows) => (
//                       <DropdownMenuItem
//                         key={rows}
//                         onClick={() => {
//                           setSelectedRowKeys(new Set([`${rows}`]));
//                           onRowsPerPageChange(rows);
//                         }}
//                       >
//                         {rows} Rows
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>

//         {/* Table Section - Clean Design */}
//         <div
//           className={`  rounded-lg overflow-hidden bg-background ${
//             theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
//           }`}
//         >
//           {isLoading ? (
//             <TableSkeleton columns={extendedColDefs.length} rows={8} />
//           ) : (
//             <AgGridReact
//               theme={theme === "dark" ? darkTheme : lightTheme}
//               ref={gridRef}
//               rowHeight={52}
//                 domLayout="autoHeight"
//               rowData={rowData}
//               loading={false}
//               columnDefs={extendedColDefs}
//               defaultColDef={defaultColDef}
//               rowSelection="multiple"
//               pagination={pagination}
//               paginationPageSize={10}
//               onSelectionChanged={handleSelectionChanged}
//               paginationPageSizeSelector={[10, 20, 30, 40, 50, 60]}
//               onGridReady={onGridReady}
//               onFilterChanged={updateFilterValues}
//               ensureDomOrder={true}
//             />
//           )}
//         </div>

//         {/* Pagination Section */}
//         {showPagination && (
//           <div className="flex items-center justify-center py-2">
//             <CustomPagination
//               current={page}
//               total={totalPages}
//               onPageChange={setPage}
//               showControls={true}
//               isCompact={true}
//             />
//           </div>
//         )}
//       </div>

//       {/* Export Progress Modal */}
//       <Dialog
//         open={isExporting}
//         onOpenChange={(open) => {
//           if (!open) cancelExport();
//         }}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <FileDown className="h-5 w-5 text-primary" />
//               Exporting Data
//             </DialogTitle>
//             <DialogDescription>Please wait while we prepare your Excel file...</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="text-muted-foreground">{exportStatus}</span>
//                 <span className="font-semibold text-foreground">{exportProgress}%</span>
//               </div>
//               <Progress value={exportProgress} className="h-2" />
//             </div>

//             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//               {exportProgress < 100 ? (
//                 <FancyLoader />
//               ) : (
//                 <div className="flex flex-col items-center gap-3">
//                   <div className="relative">
//                     <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in-50 duration-300" />
//                     <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
//                   </div>
//                   <div className="text-center space-y-2">
//                     <h3 className="text-lg font-semibold animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
//                       File is Ready!
//                     </h3>
//                     <p className="text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100">
//                       Your Excel file has been downloaded successfully.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default DataTable;

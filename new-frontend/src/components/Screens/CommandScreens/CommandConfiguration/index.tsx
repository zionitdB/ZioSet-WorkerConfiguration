

import { useState, useMemo, useEffect } from "react";
import {
  Command,
  Loader2,
  RefreshCw,
  Pencil,
  Trash,
} from "lucide-react";

import DataTable from "@/components/common/DataTable";
import CustomModal from "@/components/common/Modal/DialogModal";
import { Button } from "@/components/ui/button";

import {
  useGetCommands,
  useGetCommandCount,
  useAddCommand,
  useUpdateCommand,
  useDeleteCommand,
  useGetActions,
  useGetCommandByGroupSearch,
  useGetCommandCountByGroupSearch,
  useGetCommandsByActionFilter,
} from "./hooks";

import CommandForm from "./form";
import UploadForm from "./upload";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CommandRoute = () => {
  /* ---------------- STATE ---------------- */
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [editData, setEditData] = useState<any>(null);

  const [filterActionId, setFilterActionId] = useState<number | null>(null);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);

  const { data, isLoading, refetch, isFetching } =
    useGetCommands(page, rowsPerPage);
  const { data: count } = useGetCommandCount();
  const { data: actions = [] } = useGetActions();

  const addMutation = useAddCommand();
  const updateMutation = useUpdateCommand();
  const deleteMutation = useDeleteCommand();

  const groupSearch = useGetCommandByGroupSearch();
  const groupSearchCount = useGetCommandCountByGroupSearch();
  const actionFilter = useGetCommandsByActionFilter();


  const tableData = useMemo(
    () => (filteredData.length ? filteredData : data || []),
    [filteredData, data]
  );

  const totalItems = isSearchActive ? searchDataCount : count || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);



  const transformData = (list: any[]) =>
    list.map((i) => ({
      ...i,
      category: i?.action?.category?.categoryname || "-",
      subCategory: i?.action?.subCategory?.categoryname || "-",
    }));

  const exportPayload = useMemo(
    () => ({
      columns: filterColumns,
      pageNo: 1,
      perPage: isSearchActive ? searchDataCount : totalItems,
    }),
    [filterColumns, isSearchActive, searchDataCount, totalItems]
  );

  const getAllCommands = useGetCommands(1, exportPayload.perPage);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise((resolve, reject) => {
        groupSearch.mutate(exportPayload, {
          onSuccess: (d: any) => resolve(transformData(d || [])),
          onError: reject,
        });
      });
    }

    return new Promise((resolve, reject) => {
      getAllCommands
        .refetch()
        .then((res: any) =>
          resolve(transformData(res.data || []))
        )
        .catch(reject);
    });
  };


  const handleGroupSearch = (filters: Record<string, any>) => {
    const hasFilters = Object.values(filters).some(
      (f) => f.filter && f.filter.trim() !== ""
    );

    if (!hasFilters) {
      setFilteredData([]);
      setFilterColumns([]);
      setIsSearchActive(false);
      setSearchDataCount(0);
      setPage(1);
      return;
    }

    const columns = Object.entries(filters).map(([key, value]) => ({
      columnName: key,
      value: value.filter,
    }));

    const payload = {
      columns,
      pageNo: 1,
      perPage: rowsPerPage,
    };

    setFilterColumns(columns);
    setIsSearchActive(true);
    setPage(1);

    groupSearch.mutate(payload, {
      onSuccess: (d: any) => setFilteredData(d || []),
    });

    groupSearchCount.mutate(payload, {
      onSuccess: (c: any) => setSearchDataCount(c || 0),
    });
  };

  useEffect(() => {
    if (!isSearchActive || !filterColumns.length) return;

    const payload = {
      columns: filterColumns,
      pageNo: page,
      perPage: rowsPerPage,
    };

    groupSearch.mutate(payload, {
      onSuccess: (d: any) => setFilteredData(d || []),
    });
  }, [page, rowsPerPage]);

  /* ---------------- ACTION FILTER (DROPDOWN) ---------------- */
  const handleActionFilterChange = (actionId: number | null) => {
    setFilterActionId(actionId);

    if (actionId) {
      actionFilter.mutate(
        { actionId },
        {
          onSuccess: (d: any) => {
            setFilteredData(d || []);
            setIsSearchActive(false);
            setFilterColumns([]);
          },
        }
      );
    } else {
      setFilteredData([]);
    }
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (p: any) =>
          (page - 1) * rowsPerPage + (p.node.rowIndex + 1),
        width: 90,
        filter: false,
      },
      {
        headerName: "Category",
        field: "action.category.categoryname",
        flex: 1,
      },
      {
        headerName: "Sub Category",
        field: "action.subCategory.categoryname",
        flex: 1,
      },
      { field: "commandId", headerName: "Command ID", flex: 1 },
      { field: "commandstr", headerName: "Command String", flex: 1 },
      { field: "schemastr", headerName: "Schema String", flex: 1 },
      {
        headerName: "Actions",
        width: 160,
        filter: false,
        cellRenderer: (p: any) => (
          <div className="flex gap-2 py-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditData(p.data);
                setIsModalOpen(true);
              }}
            >
              <Pencil />
            </Button>
            {/* <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditData(p.data);
                setUploadModalOpen(true);
              }}
            >
              <Upload className="h-4 w-4" />
            </Button> */}
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                deleteMutation.mutate(p.data.id, {
                  onSuccess: () => refetch(),
                })
              }
            >
              <Trash />
            </Button>
          </div>
        ),
      },
    ],
    [page, rowsPerPage]
  );

  /* ---------------- HEADER ACTION ---------------- */
  const addComponent = (
    <Button
      onClick={() => refetch()}
      disabled={isFetching}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isFetching ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </>
      )}
    </Button>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto py-6 space-y-6">
  

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Command className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Command</span> Configuration
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage command configuration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={filterActionId ? String(filterActionId) : ""}
            onValueChange={(val) =>
              handleActionFilterChange(val ? Number(val) : null)
            }
          >
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Filter by Action" />
            </SelectTrigger>
            <SelectContent>
              {actions.map((a: any) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.actionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
            <Command className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        rowData={tableData}
        colDefs={columnDefs}
        isLoading={isLoading}
        addComponent={addComponent}
        onAddClick={() => {
          setEditData(null);
          setIsModalOpen(true);
        }}
        showActions={false}
        showExportButton
        allData={allDataForExport}
        fileName="command-configuration"
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
      />

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dialogTitle={editData ? "Edit Command" : "Add Command"}
        width="max-w-2xl"
      >
        <CommandForm
          defaultValues={editData}
          onSubmit={(payload: any) => {
            const action = editData ? updateMutation : addMutation;
            action.mutate(payload, {
              onSuccess: () => {
                refetch();
                setIsModalOpen(false);
              },
            });
          }}
        />
      </CustomModal>

      <CustomModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        dialogTitle={`Upload for ${editData?.commandId || ""}`}
        width="max-w-md"
      >
        <UploadForm
          commandId={editData?.id}
          onClose={() => setUploadModalOpen(false)}
        />
      </CustomModal>
    </div>
  );
};

export default CommandRoute;



import { useState, useMemo, useEffect } from "react";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import CustomModal from "@/components/common/Modal/DialogModal";
import { Button } from "@/components/ui/button";

import {
  useGetActions,
  useGetActionCount,
  useAddAction,
  useUpdateAction,
  useDeleteAction,
  useGetActionsByGroupSearch,
  useGetActionCountByGroupSearch,
} from "./hooks";

import ActionForm from "./form";
import UploadActionForm from "./upload-form";
import Breadcrumb from "@/components/common/breadcrumb";

const ActionRoute = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [editData, setEditData] = useState<any>(null);
  const [selectedRow] = useState<any>(null);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);

  const { data, isLoading, refetch, isFetching } =
    useGetActions(page, rowsPerPage);
  const { data: count } = useGetActionCount();

  const addMutation = useAddAction();
  const updateMutation = useUpdateAction();
  const deleteMutation = useDeleteAction();

  const groupSearch = useGetActionsByGroupSearch();
  const groupSearchCount = useGetActionCountByGroupSearch();

  const tableData = useMemo(
    () => (filteredData.length ? filteredData : data || []),
    [filteredData, data]
  );

  const totalItems = isSearchActive ? searchDataCount : count || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);


  const transformData = (list: any[]) =>
    list.map((i) => ({
      ...i,
      // category: i?.category?.categoryname || "-",
      // subCategory: i?.subCategory?.categoryname || "-",
    }));

  const exportPayload = useMemo(
    () => ({
      columns: filterColumns,
      pageNo: 1,
      perPage: isSearchActive ? searchDataCount : totalItems,
    }),
    [filterColumns, isSearchActive, searchDataCount, totalItems]
  );

  const getAllActions = useGetActions(1, exportPayload.perPage);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise((resolve, reject) => {
        groupSearch.mutate(exportPayload, {
          onSuccess: (d: any) =>
            resolve(transformData(d || [])),
          onError: reject,
        });
      });
    }

    return new Promise((resolve, reject) => {
      getAllActions
        .refetch()
        .then((res: any) =>
          resolve(transformData(res.data || []))
        )
        .catch(reject);
    });
  };








  
  /* ---------------- GROUP SEARCH ---------------- */
  const handleGroupSearch = (filters: Record<string, any>) => {

       console.log("filters",filters);

       
    const hasFilters = Object.values(filters).some(
      (f) => f.filter && f.filter.trim() !== ""
    );

    if (!hasFilters) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = {
      columns: Object.entries(filters).map(([key, value]) => ({
        columnName: key,
        value: value.filter,
      })),
      pageNo: page,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);

    groupSearch.mutate(payload, {
      onSuccess: (data) => setFilteredData(data || []),
    });

    groupSearchCount.mutate(payload, {
      onSuccess: (count) => setSearchDataCount(count || 0),
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

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (p: any) =>
          (page - 1) * rowsPerPage + (p.node.rowIndex + 1),
        width: 80,
        filter: false,
      },
      {
        headerName: "Name",
        field: "actionName",
        minWidth: 250,
        cellRenderer: (p: any) => (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-200">
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                  p.data?.actionName || "default"
                )}`}
                alt="avatar"
              />
            </div>
            <span className="font-semibold">{p.value}</span>
          </div>
        ),
      },
      {
          field: "category.categoryname",
        headerName: "Category",
        cellRenderer: (p: any) =>
          p.data?.category?.categoryname || "-",
        flex: 1,
      },
      {
           field: "subCategory.categoryname",
        headerName: "Sub Category",
        cellRenderer: (p: any) =>
          p.data?.subCategory?.categoryname || "-",
        flex: 1,
      },
      {
        field: "informationtype",
        headerName: "Information Type",
        flex: 1,
      },
      {
        field: "informationdetail",
        headerName: "Information Details",
        flex: 2,
      },
      // {
      //   headerName: "Upload",
      //   filter: false,
      //   width: 120,
      //   cellRenderer: (p: any) => (
      //     <Button
      //       size="sm"
      //       variant="outline"
      //       onClick={() => {
      //         setSelectedRow(p.data);
      //         setIsUploadOpen(true);
      //       }}
      //     >
      //       <Upload className="h-4 w-4 mr-1" />
      //       Upload
      //     </Button>
      //   ),
      // },
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
      <Breadcrumb
        items={[
          { label: "Module Dashboard", path: "/dashboard" },
          { label: "Actions" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Actions</span> Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage actions and permissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
          <Activity className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{totalItems}</p>
          </div>
        </div>
      </div>

      <DataTable
        rowData={tableData}
        colDefs={columns}
        isLoading={isLoading}
        addComponent={addComponent}
        onAddClick={() => {
          setEditData(null);
          setIsModalOpen(true);
        }}
        onEditClick={(row) => {
          setEditData(row);
          setIsModalOpen(true);
        }}
        onDeleteClick={(row) =>
          deleteMutation.mutate(row.id, {
            onSuccess: () => refetch(),
          })
        }
        showEdit
        showDelete
        showExportButton
        allData={allDataForExport}
        fileName="actions"
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
        dialogTitle={editData ? "Edit Action" : "Add Action"}
        formId="action-form"
      >
        <ActionForm
          formId="action-form"
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
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        dialogTitle={`Upload for ${selectedRow?.actionName || ""}`}
      >
        <UploadActionForm
          actionId={selectedRow?.id}
          onSuccess={() => setIsUploadOpen(false)}
        />
      </CustomModal>
    </div>
  );
};

export default ActionRoute;

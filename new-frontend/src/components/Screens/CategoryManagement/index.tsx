

import { useState, useMemo, useEffect } from "react";
import { Eye, Loader2, RefreshCw, Users } from "lucide-react";
import CustomModal from "@/components/common/Modal/DialogModal";
import DataTable from "@/components/common/DataTable";
import CategoryForm from "./form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetCategories,
  useGetCategoryCount,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
  useGetCategoryByGroupSearch,
  useGetCategoryCountByGroupSearch,
} from "./hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/breadcrumb";

const CategoryRoute = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [Id, setId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  /* ---------------- API ---------------- */
  const { data: rowData, isLoading, refetch, isFetching } =
    useGetCategories(page, rowsPerPage);
  const { data: totalCount } = useGetCategoryCount();

  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const getCategoryByGroupSearch = useGetCategoryByGroupSearch();
  const getCategoryCountByGroupSearch = useGetCategoryCountByGroupSearch();

  /* ---------------- DATA SOURCE ---------------- */
  const serviceData = useMemo(
    () => (filteredData.length ? filteredData : rowData || []),
    [filteredData, rowData]
  );

  const totalItems = isSearchActive
    ? searchDataCount
    : totalCount || serviceData.length;

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  /* ---------------- STATS ---------------- */
  const stats = useMemo(() => {
    const parentCategories = new Set(
      serviceData
        .map((c: any) => c?.parrentCategory?.id)
        .filter(Boolean)
    ).size;

    return {
      total: totalItems,
      parents: parentCategories,
    };
  }, [serviceData, totalItems]);

  /* ---------------- COLUMNS ---------------- */
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (params: any) =>
          (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
        width: 80,
        filter: false,
      },
      { field: "categoryname", headerName: "Category", flex: 1 },
      {
        field: "parrentCategory",
        headerName: "Parent Category",
        flex: 1,
        cellRenderer: (params: any) =>
          params.data?.parrentCategory?.categoryname || "-",
      },
      { field: "createdDate", headerName: "Created Date", flex: 1 ,   filter: false,},
      // {
      //   field: "active",
      //   headerName: "Status",
      //   flex: 1,
      //   filter: false,
      //   cellRenderer: (params: any) => {
      //     const isActive = params.data?.active === 1;
      //     return (
      //       <Badge
      //         variant={isActive ? "default" : "destructive"}
      //         className={`px-3 py-1 text-sm rounded-full ${
      //           isActive
      //             ? "bg-primary hover:bg-primary/20"
      //             : "bg-red-500 hover:bg-red-600"
      //         } text-white`}
      //       >
      //         {isActive ? "Active" : "Inactive"}
      //       </Badge>
      //     );
      //   },
      // },
      {
        headerName: "Detailed View",
        width: 120,
        filter: false,
        cellRenderer: (params: any) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDetailView(params.data)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Detail</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
    ],
    [page, rowsPerPage]
  );

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

    getCategoryByGroupSearch.mutate(payload, {
      onSuccess: (data) => setFilteredData(data || []),
    });

    getCategoryCountByGroupSearch.mutate(payload, {
      onSuccess: (count) => setSearchDataCount(count || 0),
    });
  };

  /* ---------------- SEARCH PAGINATION ---------------- */
  useEffect(() => {
    if (isSearchActive && filterColumns.length) {
      const payload = {
        columns: filterColumns,
        pageNo: page,
        perPage: rowsPerPage,
      };

      getCategoryByGroupSearch.mutate(payload, {
        onSuccess: (data) => setFilteredData(data || []),
      });
    }
  }, [page, rowsPerPage]);

  /* ---------------- EXPORT ---------------- */
  const transformData = (data: any[]) =>
    data.map((item) => ({
      ...item,
      parrentCategory:
        item?.parrentCategory?.categoryname || "-",
        // active:  item?.data?.active || "-",
    }));

  const exportPayload = useMemo(
    () => ({
      columns: filterColumns,
      pageNo: 1,
      perPage: isSearchActive ? searchDataCount : totalItems,
    }),
    [filterColumns, isSearchActive, searchDataCount, totalItems]
  );

  const getAllData = useGetCategories(1, exportPayload.perPage);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise((resolve, reject) => {
        getCategoryByGroupSearch.mutate(exportPayload, {
          onSuccess: (data) =>
            resolve(transformData(data || [])),
          onError: reject,
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        getAllData
          .refetch()
          .then((res: any) =>
            resolve(transformData(res.data || []))
          )
          .catch(reject);
      });
    }
  };

  /* ---------------- HANDLERS ---------------- */
  const handleAddClick = () => {
    setEditData(null);
    setId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (data: any) => {
    setEditData(data);
    setId(data.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (Id) {
      updateMutation.mutate(
        { ...data, id: Id },
        { onSuccess: () => refetch() }
      );
    } else {
      addMutation.mutate(data, {
        onSuccess: () => refetch(),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (data: any) => {
    setDeleteTarget(data);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          refetch();
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  const handleDetailView = (row: any) => {
    navigate("/agentConfiguration/CategoriesTreeview", {
      state: { row },
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Module Dashboard", path: "/dashboard" },
          { label: "Category" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Category</span> Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage system categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{stats.total}</p>
          </div>
        </div>
      </div>

      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={isLoading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
        showEdit
        showDelete
        showExportButton
        pagination={false}
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        addComponent={
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}{" "}
            Refresh
          </Button>
        }
        fileName="categories"
        allData={allDataForExport}
      />

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dialogTitle={Id ? "Edit Category" : "Add Category"}
        dialogDescription={
          Id ? "Update category details" : "Add a new category"
        }
        formId="category-form"
        width="max-w-lg"
      >
        <CategoryForm
          onSubmit={handleSubmit}
          formId="category-form"
          defaultValues={editData}
        />
      </CustomModal>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Delete category{" "}
              <strong>{deleteTarget?.categoryname}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryRoute;

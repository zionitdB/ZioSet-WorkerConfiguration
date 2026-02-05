
import { useState, useMemo, useEffect } from "react";
import { Loader2, RefreshCw, Users, UserCheck, UserX, Shield, CheckCircle2, XCircle } from "lucide-react";
import CustomModal from "@/components/common/Modal/DialogModal";
import DataTable from "@/components/common/DataTable";
import {
  useGetUsers,
  useGetUserCount,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
  useGetUsersByGroupSearch,
  useGetUserCountByGroupSearch,
} from "./hooks";
import UserForm from "./form";
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
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/common/breadcrumb";

const UserRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>("");
  const [Id, setId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: rowData, isLoading, refetch, isFetching } = useGetUsers(page, rowsPerPage);
  const { data: userCount } = useGetUserCount();

  const addMutation = useAddUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const getUsersByGroupSearch = useGetUsersByGroupSearch();
  const getUserCountByGroupSearch = useGetUserCountByGroupSearch();

  const serviceData = useMemo(() => (filteredData.length ? filteredData : rowData || []), [filteredData, rowData]);

  const totalItems = isSearchActive ? searchDataCount : userCount || serviceData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // const { routes } = usePermissions();

  // const masterPermission = routes?.machinemasterPermission || [];
  // const Permission = masterPermission.find(
  //   (permission: any) => permission.permissionsName === "User Management"
  // );

  // const PermissionActions =
  //   Permission?.actions
  //     ?.filter((action: any) => action.selected)
  //     .map((action: any) => action.actionName) || [];

  const canView = true;
  const canAdd = true;
  const canEdit = true;
  const canDelete = true;
  const canExport = true;


  const stats = useMemo(() => {
    const active = serviceData.filter((user: any) => user.active === 1).length;
    const inactive = serviceData.filter((user: any) => user.active !== 1).length;
    const departments = new Set(
      serviceData.map((user: any) => user?.department?.departmentName).filter(Boolean)
    ).size;
    const roles = new Set(
      serviceData.map((user: any) => user?.role?.roleName).filter(Boolean)
    ).size;
    return { active, inactive, departments, roles };
  }, [serviceData]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (params: any) => (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
        width: 80,
        filter: false,
      },
      { field: "firstName", headerName: "First Name", flex: 1 },
      { field: "lastName", headerName: "Last Name", flex: 1 },
      { field: "username", headerName: "User Name", flex: 1 },
      { field: "email", headerName: "Email", flex: 1 },
      // { field: "password", headerName: "Password.", flex: 1 },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
        cellRenderer: (params: any) => params?.data?.role?.roleName || "-",
      },
      {
        field: "active",
        headerName: "Status",
        flex: 1,
        filter: false,
        cellRenderer: (params: any) => {
          const isActive = params.data?.active == 1;
          return (
           

             <Badge
              variant="outline"
              className={`gap-1 border ${
                isActive
                  ? "border-green-500 text-green-600 bg-green-500/10"
                  : "border-red-500 text-red-600 bg-red-500/10"
              }`}
            >
              {isActive ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
                {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
    ],
    [page, rowsPerPage]
  );

  const handleSubmit = (data: any) => {
    if (Id) {
      updateMutation.mutate({ ...data, id: Id }, { onSuccess: () => refetch() });
    } else {
      addMutation.mutate(data, { onSuccess: () => refetch() });
    }
    setIsModalOpen(false);
  };

  const handleGroupSearch = (filters: Record<string, any>) => {
    const hasFilters = Object.values(filters).some((f) => f.filter && f.filter.trim() !== "");
    if (!hasFilters) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = {
      columns: Object.entries(filters).map(([key, value]) => ({ columnName: key, value: value.filter })),
      pageNo: page,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);

    getUsersByGroupSearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    getUserCountByGroupSearch.mutate(payload, { onSuccess: (count) => setSearchDataCount(count || 0) });
  };

  useEffect(() => {
    if (isSearchActive && filterColumns?.length) {
      const payload = { columns: filterColumns, pageNo: page, perPage: rowsPerPage };
      getUsersByGroupSearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    }
  }, [page, rowsPerPage]);




  const transformData = (data: any[]) =>
    data.map((item) => ({
      ...item,
      department: item?.department?.departmentName || "-",
      role: item?.role?.roleName || "-",
    }));

  const exportPayload = useMemo(
    () => ({
      columns: filterColumns,
      pageNo: 1,
      perPage: isSearchActive ? searchDataCount : totalItems,
    }),
    [filterColumns, isSearchActive, searchDataCount, totalItems]
  );

  const getAllData = useGetUsers(1, exportPayload.perPage);

  const allDataForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise<any[]>((resolve, reject) => {
        getUsersByGroupSearch.mutate(exportPayload, {
          onSuccess: (data) => resolve(transformData(data)),
          onError: reject,
        });
      });
    } else {
      return new Promise<any[]>((resolve, reject) => {
        getAllData
          .refetch()
          .then((res: any) => resolve(transformData(res.data || [])))
          .catch((err: any) => reject(err));
      });
    }
  };

  const handleAddClick = () => {
    setEditData("");
    setId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (data: any) => {
    setEditData(data);
    setId(data.userId);
    setIsModalOpen(true);
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

  const addComponent = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => refetch()}
        disabled={isFetching}
        variant="outline"
        className="flex items-center gap-2 shadow-sm"
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

  if (!canView) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="rounded-2xl border-2 border-destructive/20 bg-card p-10 shadow-2xl max-w-md">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 animate-pulse">
              <UserX className="h-10 w-10 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-destructive mb-2">Access Denied</h1>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
 <div className="mb-6">
          <Breadcrumb
            items={[
              {
                label: "Module Dashboard",
                path: "/app/dashboard",
              },
              {
                label: "User Management",
              },
            ]}
          />
        </div>
        
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border">

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
     <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">User</span>  Management
          </h1>
            <p className="text-sm text-muted-foreground">Manage system users and permissions</p>
          </div>
        </div>

        {/* Inline Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
            <Users className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">{totalItems}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 rounded-lg border border-green-500/10">
            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.active}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 rounded-lg border border-red-500/10">
            <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
            </div>
          </div>

        
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/5 rounded-lg border border-purple-500/10">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Roles</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.roles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        rowData={serviceData}
        colDefs={columnDefs}
        isLoading={isLoading}
        addComponent={addComponent}
        onAddClick={canAdd ? handleAddClick : undefined}
        onEditClick={canEdit ? handleEditClick : undefined}
        onDeleteClick={canDelete ? handleDelete : undefined}
        showEdit={canEdit}
        showDelete={canDelete}
        showExportButton={canExport}
        pagination={false}
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onFilterChange={handleGroupSearch}
        fileName="users"
        allData={allDataForExport}
      />

      {/* Add/Edit Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dialogTitle={Id ? "Edit User" : "Add User"}
        dialogDescription={Id ? "Update user details here..." : "Add a new user here..."}
        formId="user-form"
        width="max-w-3xl"
        height="h-auto"
      >
        <UserForm onSubmit={handleSubmit} formId="user-form" defaultValues={editData} />
      </CustomModal>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <UserX className="h-6 w-6 text-destructive" />
              </div>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2">
              Are you sure you want to delete user{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-lg"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserRoute;
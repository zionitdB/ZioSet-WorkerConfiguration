
import  { useState } from "react";
import {
  useDeleteRole,
  useGetRole,
  useRolesRegister,
  useUpdaterole,
} from "./hooks";
import RoleForm from "./form";
import DataTable from "@/components/common/DataTable";
import CustomModal from "@/components/common/Modal/DialogModal";
import Breadcrumb from "@/components/common/breadcrumb";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const RoleRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>("");

  const { data: rowData, isLoading, refetch } = useGetRole(); 
  const addRegisterMutation = useRolesRegister();
  const UpdateRoleMutation = useUpdaterole(roleId);
  const DeleteRoleMutation = useDeleteRole(roleId);
  // const roleData = rowData?.data || [];

  const columnDefs = [
    {
      field: "srNo",
      headerName: "Sr No.",
      cellRenderer: (params: any) => params.node.rowIndex + 1,
        filter:false,
    },
    { field: "roleName", headerName: "Role Name" },
  ];

  const handleOpenChange = () => {
    setEditData(""); // Ensure form is reset for adding a new role
    setRoleId(null); // Reset role ID to indicate adding mode
    setIsModalOpen(true);
  };

  const handleCloseAction = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (formData: any) => {
    if (roleId) {
      // Call update mutation if editing
      UpdateRoleMutation.mutate(formData, {
        onSuccess: () => {
          refetch(); // Refetch data after a successful update
          console.log("refetch Edit");
        },
      });
    } else {
      // Call register mutation if adding new role
      addRegisterMutation.mutate(formData, {
        onSuccess: () => {
          refetch(); // Refetch data after a successful add
          console.log("refetch add new");
        },
      });
    }
    setIsModalOpen(false);
  };

  const handleEdit = (data: any) => {
    setRoleId(data?.roleId); // Ensure 'roleId' exists in 'data'
    setEditData(data); // Set the data for editing
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = (data: any) => {
    setRoleId(data?.roleId); // Set the roleId to be deleted
    setIsDeleteConfirmationOpen(true); // Open confirmation modal
  };

  const confirmDelete = (roleId: any) => {
    if (roleId) {
      DeleteRoleMutation.mutate(roleId, {
        onSuccess: () => {
          refetch(); // Refetch data after a successful delete
        },
      });
    }
    setIsDeleteConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };


  return (
    <div>
   <div className="mb-6">
          <Breadcrumb
            items={[
              {
                label: "Module Dashboard",
                path: "/app/dashboard",
              },
              {
                label: "Role",
              },
            ]}
          />
        </div>


<div className="flex items-center justify-center mb-6">
  <div className="flex flex-col items-center justify-center text-center">
    <h1 className="text-3xl font-bold tracking-tight text-primary">Role Management</h1>
    <p className="text-muted-foreground">
      Total Role: {rowData?.length || 0}
    </p>
  </div>
</div>

      <DataTable
        rowData={rowData}
        colDefs={columnDefs}
        isLoading={isLoading}
        onAddClick={handleOpenChange}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        pagination={true} 
        showPagination={false}
        onRowsPerPageChange={undefined}      />

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseAction}
        dialogTitle={roleId ? "Edit Role" : "Register Role"}
        dialogDescription={
          roleId
            ? "Edit your Role details here..."
            : "Register your Role here..."
        }
        formId="role-form"
        width="max-w-4xl"
        height="h-auto"
      >
        <RoleForm
          onSubmit={handleSubmit}
          formId="role-form"
          defaultValues={editData} // Set the form default values to the edit data
        />
      </CustomModal>

      {/* Confirmation Modal for Deletion */}
      <CustomModal
        isOpen={isDeleteConfirmationOpen}
        onClose={cancelDelete}
        dialogTitle="Confirm Deletion"
        dialogDescription="Are you sure you want to delete this role?"
        formId="delete-confirmation-form"
        width="30%"
        height="30%"
        showCloseButton={false}
        showSaveButton={false}
      >
        <div className="flex justify-around mt-4">
          {/* Confirm Button */}
          <button
            onClick={confirmDelete}
            className="btn btn-danger bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirm
          </button>

          {/* Cancel Button */}
          <button
            onClick={cancelDelete}
            className="btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default RoleRoute;

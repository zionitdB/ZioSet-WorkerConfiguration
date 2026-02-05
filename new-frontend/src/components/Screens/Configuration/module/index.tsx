import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import CustomModal from "@/components/common/Modal/DialogModal";
import ModuleForm from "./form";
import { useGetModules, useAddModule } from "./hooks";
import Breadcrumb from "@/components/common/breadcrumb";

const ModuleRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: modules = [], isLoading, refetch, isFetching } =
    useGetModules();
  const addModuleMutation = useAddModule();

  const totalItems = modules.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return modules.slice(start, start + rowsPerPage);
  }, [modules, currentPage, rowsPerPage]);

  const columnDefs = [
    {
      field: "srNo",
      headerName: "Sr.No",
      cellRenderer: (params: any) =>
        (currentPage - 1) * rowsPerPage + params.node.rowIndex + 1,
      filter: false,
    },
    { field: "moduleName", headerName: "Module Name" },
    {
      field: "active",
      headerName: "Status",
      cellRenderer: (params: any) =>
        params.value ? "Active" : "Inactive",
    },
  ];

  const handleSubmit = (data: any) => {
    addModuleMutation.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const addComponent = (
    <Button onClick={() => refetch()} disabled={isFetching}>
      {isFetching ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Refreshing...
        </>
      ) : (
        "Refresh"
      )}
    </Button>
  );

  return (
    <div className="container mx-auto py-6">
         <div className="mb-6">
                <Breadcrumb
                  items={[
                    {
                      label: "Module Dashboard",
                      path: "/app/dashboard",
                    },
                    {
                      label: "Module",
                    },
                  ]}
                />
              </div>

              
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Module Master</h1>
        <p className="text-muted-foreground">
          Total Modules: {totalItems}
        </p>
      </div>

      <DataTable
        rowData={paginatedData}
        colDefs={columnDefs}
        isLoading={isLoading}
        addComponent={addComponent}
        addLabel="Add Module"
        onAddClick={() => setIsModalOpen(true)}
        showEdit={false}
        showDelete={false}
        pagination={false}
        showFilter={false}
        showExportButton={false}
        showActions={false}
        showPagination
        page={currentPage}
        totalPages={totalPages}
        setPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dialogTitle="Add Module"
        dialogDescription="Add module details below."
        formId="module-form"
      >
        <ModuleForm
          formId="module-form"
          onSubmit={handleSubmit}
        />
      </CustomModal>
    </div>
  );
};

export default ModuleRoute;

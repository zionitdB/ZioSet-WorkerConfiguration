import { useState, useMemo } from "react";
import {
  Loader2,
  RefreshCw,
  Terminal,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import CustomModal from "@/components/common/Modal/DialogModal";
import DataTable from "@/components/common/DataTable";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommandConfigForm from "./form";
import {
  useGetAllActions,
  useGetCommandIdListByAction,
  useGetCommandsByCommandId,
  useAddCommandConfig,
  useUpdateCommandConfig,
  useDeleteCommandConfig,
} from "./hooks";
import toast from "react-hot-toast";

// --- Custom Components for Filter/Header ---

interface ActionSelectProps {
  actionId: string | null;
  setActionId: (id: string | null) => void;
  isLoading: boolean;
}

const ActionSelect: React.FC<ActionSelectProps> = ({
  actionId,
  setActionId,
  isLoading,
}) => {
  const { data: actions = [] } = useGetAllActions();

  return (
    <div className="space-y-1 w-full max-w-xs">
      <label className="text-sm font-medium text-muted-foreground">
        Select Action
      </label>
      <Select
        value={actionId || ""}
        onValueChange={(val) => setActionId(val)}
        disabled={isLoading || actions.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose Action" />
        </SelectTrigger>
        <SelectContent>
          {actions.map((action: any) => (
            <SelectItem key={action.id} value={action.id.toString()}>
              {action.actionName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface CommandIdSelectProps {
  actionId: string | null;
  commandId: string | null;
  setCommandId: (id: string | null) => void;
}

const CommandIdSelect: React.FC<CommandIdSelectProps> = ({
  actionId,
  commandId,
  setCommandId,
}) => {
  const { data: commandIds = [], isLoading: isLoadingIds } =
    useGetCommandIdListByAction(actionId);

  return (
    <div className="space-y-1 w-full max-w-xs">
      <label className="text-sm font-medium text-muted-foreground">
        Select Command Group ID
      </label>
      <Select
        value={commandId || ""}
        onValueChange={(val) => setCommandId(val)}
        disabled={!actionId || isLoadingIds || commandIds.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose Command Group ID" />
        </SelectTrigger>
        <SelectContent>
          {commandIds.map((id: string) => (
            <SelectItem key={id} value={id}>
              {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const CommandConfigRoute = () => {
  const [actionId, setActionId] = useState<string | null>(null);
  const [commandId, setCommandId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: actionsData, isLoading: isLoadingActions } = useGetAllActions();
  const {
    data: rowData,
    isLoading: isLoadingCommands,
    refetch: refetchCommands,
    isFetching: isFetchingCommands,
  } = useGetCommandsByCommandId(page, rowsPerPage, commandId);

  const tableData = useMemo(() => rowData?.content || [], [rowData]);

  const totalItems = rowData?.totalElements || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || rowData?.totalPages;

  const addMutation = useAddCommandConfig();
  const updateMutation = useUpdateCommandConfig();
  const deleteMutation = useDeleteCommandConfig();

  const handleActionChange = (id: string | null) => {
    setActionId(id);
    setCommandId(null);
  };

  const handleSubmit = (data: any) => {
    const isEdit = data.id;

    const onSuccessCallback = () => {
      refetchCommands();
      setIsModalOpen(false);
    };

    const payload = isEdit ? data : { ...data, commandId: commandId };

    if (isEdit) {
      updateMutation.mutate(payload, { onSuccess: onSuccessCallback });
    } else {
      addMutation.mutate(payload, { onSuccess: onSuccessCallback });
    }
  };

  const transformData = (data: any[]) =>
    data.map((item) => ({
      ...item,
    }));

  const getAllData = useGetCommandsByCommandId(
    1,
    totalItems || 10000,
    commandId,
  );

  const allDataForExport = async (): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      getAllData
        .refetch()
        .then((res: any) => resolve(transformData(res.data?.content || [])))
        .catch((err: any) => reject(err));
    });
  };

  const handleAddClick = () => {
    if (!actionId || !commandId) {
      toast.error("Select Action and Command Group ID");
      return;
    }

    const currentAction = actionsData.find(
      (a: any) => a.id.toString() === actionId,
    );

    setEditData({
      action: currentAction,
      commandId: commandId,
    });

    setIsModalOpen(true);
  };

  const handleEditClick = (data: any) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (data: any) => {
    setDeleteTarget(data);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          refetchCommands();
          
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (params: any) => params.node.rowIndex + 1,
        width: 80,
        filter: false,
      },
      { field: "commandId", headerName: "Command Group ID", width: 150 },
      { field: "commandstr", headerName: "Command String", flex: 2 },
      { field: "schemastr", headerName: "Schema String", flex: 1 },
      {
        field: "action.actionName",
        headerName: "Action Name",
        flex: 1,
        cellRenderer: (params: any) => params?.data?.action?.actionName || "-",
      },
    ],
    [],
  );

  const addComponent = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => refetchCommands()}
        disabled={isFetchingCommands || !commandId}
        variant="outline"
        className="flex items-center gap-2 shadow-sm"
      >
        {isFetchingCommands ? (
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

  return (
    <div className="container mx-auto  space-y-6">
      {/* Header and Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="text-primary"> Group Command</span> Configuration
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage command strings and schema definitions.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Get List Section */}
      <div className="p-4 border rounded-xl shadow-sm bg-card">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
          <SlidersHorizontal className="h-5 w-5" /> Filter Commands
        </h3>
        <div className="flex flex-col md:flex-row items-end gap-4">
          <ActionSelect
            actionId={actionId}
            setActionId={handleActionChange}
            isLoading={isLoadingActions}
          />
          <CommandIdSelect
            actionId={actionId}
            commandId={commandId}
            setCommandId={setCommandId}
          />
          {/* <Button
            onClick={handleGetList}
            disabled={!commandId || isLoadingCommands}
            className="flex items-center gap-2 w-full md:w-auto bg-primary hover:bg-primary/90"
          >
            {isLoadingCommands ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ListPlus className="h-4 w-4" />
            )}
            Get List
          </Button> */}
        </div>
      </div>


      <DataTable
        rowData={tableData}
        colDefs={columnDefs}
        isLoading={isLoadingCommands}
        addComponent={addComponent}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
        showEdit
        showDelete
        showExportButton={true}
        pagination={false}
        showPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        showFilter={false}
        allData={allDataForExport}
        fileName="group-command"
      />

      {/* Add/Edit Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dialogTitle={
          editData.id
            ? "Edit Command Configuration"
            : "Add Command Configuration"
        }
        dialogDescription={
          editData.id
            ? "Update command configuration details."
            : `Add a new command config for Command Group ID: ${commandId}`
        }
        formId="command-config-form"
        width="max-w-4xl"
        height="h-auto"
      >
        <CommandConfigForm
          selectedData={editData}
          selectedAction={editData?.action}
          selectedCommandId={editData?.commandId}
          isEditMode={!!editData?.id}
          onSubmit={handleSubmit}
          formId="command-config-form"
        />
      </CustomModal>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Terminal className="h-6 w-6 text-destructive" />
              </div>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2">
              Are you sure you want to delete the command:{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.commandstr}
              </span>{" "}
              (ID: {deleteTarget?.commandId})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-lg"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Command"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommandConfigRoute;

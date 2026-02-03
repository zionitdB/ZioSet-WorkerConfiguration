


import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface CommandRow {
  commandstr: string;
  schemastr: string;
}

interface Props {
  selectedData?: any;
  selectedAction: any;
  selectedCommandId: string;
  isEditMode: boolean;
  onSubmit: (payload: any) => void;
   formId:any;
}

const CommandConfigForm: React.FC<Props> = ({
  selectedData,
  selectedAction,
  selectedCommandId,
  isEditMode,
  onSubmit,
  formId,
}) => {
  const [action, setAction] = useState<any>(null);
  const [commandId, setCommandId] = useState("");
  const [rows, setRows] = useState<CommandRow[]>([
    { commandstr: "", schemastr: "" },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && selectedData) {
      setAction(selectedData.action);
      setCommandId(selectedData.commandId);
      setRows([
        {
          commandstr: selectedData.commandstr,
          schemastr: selectedData.schemastr,
        },
      ]);
    } else {
      setAction(selectedAction);
      setCommandId(selectedCommandId);
      setRows([{ commandstr: "", schemastr: "" }]);
    }
  }, [isEditMode, selectedData]);

  const handleChange = (
    index: number,
    field: keyof CommandRow,
    value: string
  ) => {
    const copy = [...rows];
    copy[index][field] = value;
    setRows(copy);
  };

  const addRow = () => {
    setRows([...rows, { commandstr: "", schemastr: "" }]);
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!action) return setError("Select Action"), false;
    for (const r of rows) {
      if (!r.commandstr.trim()) return setError("Enter Command String"), false;
      if (!r.schemastr.trim()) return setError("Enter Schema String"), false;
    }
    setError("");
    return true;
  };

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); 
    if (!validate()) return;

    const payload = {
      ...(selectedData?.id ? { id: selectedData.id } : {}),
      action: { id: action.id },
      list: rows.map((r) => ({
        ...r,
        commandId,
      })),
    };

    onSubmit(payload);
  };

  return (
      <form id={formId} onSubmit={handleSubmit} className="space-y-6 p-3">
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Action</Label>
          <Input value={action?.actionName || ""} disabled />
        </div>
        <div className="space-y-2"> 
          <Label>Command Group ID</Label>
          <Input
            value={commandId}
            onChange={(e) => setCommandId(e.target.value)}
            disabled={isEditMode}
          />
        </div>
      </div>

      <div className="border-t my-4" />

      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-3 p-4  border rounded-lg relative"
        >
          <div className="col-span-6 space-y-2">
            <Label>Command String *</Label>
            <Input
              value={row.commandstr}
              onChange={(e) =>
                handleChange(index, "commandstr", e.target.value)
              }
              disabled={isEditMode}
            />
          </div>

          <div className="col-span-6 space-y-2">
            <Label>Schema String *</Label>
            <Input
              value={row.schemastr}
              onChange={(e) =>
                handleChange(index, "schemastr", e.target.value)
              }
            />
          </div>

          {!isEditMode && rows.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteRow(index)}
              className="absolute top-2 right-2 mb-4 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}


            {!isEditMode && (
        <Button
          type="button"
          onClick={addRow}
          variant="outline"
          className="w-full border-dashed border-2 text-primary hover:bg-primary/5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add More Command/Schema Pair
        </Button>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

    
    </div>
    </form>
  );
};

export default CommandConfigForm;

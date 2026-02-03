import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetActions, useGetNewCommandId } from "./hooks";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface CommandFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  formId: any;
}

const emptyCommand = {
  commandId: "",
  commandstr: "",
  schemastr: "",
};

const CommandForm: React.FC<CommandFormProps> = ({
  onSubmit,
  defaultValues = null,
  formId,
}) => {
  const { data: actions = [] } = useGetActions();
  const { data: newCommandId } = useGetNewCommandId();

  const [actionId, setActionId] = useState<string>(defaultValues?.action?.id?.toString());
  const [commandId, setCommandId] = useState<number | null>(newCommandId);

  const [commands, setCommands] = useState<any[]>([emptyCommand]);
  console.log("defaultValues?.action?.id",defaultValues?.action?.id);
    console.log("actionId",actionId);
  /* ---------------- SYNC ADD / EDIT MODE ---------------- */
  useEffect(() => {
    // EDIT MODE
    if (defaultValues?.id) {
      setCommandId(defaultValues.commandId);
      // setActionId(defaultValues?.action?.id?.toString() || "");

      setCommands([
        {
          commandId: defaultValues.commandId,
          commandstr: defaultValues.commandstr,
          schemastr: defaultValues.schemastr,
        },
      ]);
    }
    // ADD MODE
    else if (newCommandId) {
      setCommandId(newCommandId);
      setActionId("");

      setCommands([
        {
          ...emptyCommand,
          commandId: newCommandId,
        },
      ]);
    }
  }, [defaultValues?.id, newCommandId]);

  /* ---------------- ROW HANDLERS ---------------- */
  const addCommand = () => {
    setCommands((prev) => [
      ...prev,
      {
        ...emptyCommand,
        commandId,
      },
    ]);
  };

  const removeCommand = (index: number) => {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCommand = (
    index: number,
    field: string,
    value: string
  ) => {
    setCommands((prev) =>
      prev.map((cmd, i) =>
        i === index ? { ...cmd, [field]: value } : cmd
      )
    );
  };

  const validate = () => {
    if (!actionId) return "Select Action";

    for (const row of commands) {
      if (!row.commandstr || !row.commandstr.trim())
        return "Enter Command String";
      if (!row.schemastr || !row.schemastr.trim())
        return "Enter Schema String";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      ...(defaultValues?.id ? { id: defaultValues.id } : {}),
      action: { id: Number(actionId) },
      list: commands.map((cmd) => ({
        commandId: commandId,
        commandstr: cmd.commandstr,
        schemastr: cmd.schemastr,
      })),
    };

    onSubmit(payload);
  };


  
  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6 p-3">
   
      <div>
        <Label>Command Id</Label>
        <Input
          placeholder="commandId"
          value={commandId ?? ""}
          disabled
        />
      </div>


      <div className="space-y-2">
        <Label>Action *</Label>
        <Select
          value={actionId}
          onValueChange={(val) => setActionId(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Action" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((act: any) => (
              <SelectItem key={act.id} value={act.id.toString()}>
                {act.actionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {commands.map((cmd, index) => (
        <div
          key={index}
          className="grid grid-cols-3 gap-4 items-end border p-3 rounded-md"
        >
          <div className="space-y-2">
            <Label>Command ID *</Label>
            <Input value={cmd.commandId} disabled />
          </div>

          <div className="space-y-2">
            <Label>Command String *</Label>
            <Input
              value={cmd.commandstr}
              onChange={(e) =>
                updateCommand(index, "commandstr", e.target.value)
              }
              placeholder="Command String"
            />
          </div>

          <div className="space-y-2">
            <Label>Schema String *</Label>
            <Input
              value={cmd.schemastr}
              onChange={(e) =>
                updateCommand(index, "schemastr", e.target.value)
              }
              placeholder="Schema String"
            />
          </div>

          {commands.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeCommand(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}


      <Button
        type="button"
        variant="outline"
        onClick={addCommand}
        disabled={!!defaultValues}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Command
      </Button>
    </form>
  );
};

export default CommandForm;

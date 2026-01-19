import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface CommandConfigFormProps {
  formId: string;
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isEdit: boolean;
}

// Type for the dynamic command/schema fields
interface CommandField {
  id: number;
  commandstr: string;
  schemastr: string;
}

const CommandConfigForm: React.FC<CommandConfigFormProps> = ({
  onSubmit,
  formId,
  defaultValues = {},
  isEdit,
}) => {
  // Initialize with default values for edit, or one empty field for add
  const initialFields: CommandField[] = useMemo(() => {
    if (isEdit && defaultValues.id) {
      return [{
        id: defaultValues.id,
        commandstr: defaultValues.commandstr || "",
        schemastr: defaultValues.schemastr || "",
      }];
    }
    return [{ id: Date.now(), commandstr: "", schemastr: "" }];
  }, [isEdit, defaultValues]);

  const [commandFields, setCommandFields] = useState<CommandField[]>(initialFields);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    commandFields.forEach((field, index) => {
      if (!field.commandstr.trim()) {
        newErrors[`commandstr_${index}`] = "Command String is required";
        isValid = false;
      }
      if (!field.schemastr.trim()) {
        newErrors[`schemastr_${index}`] = "Schema String is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (id: number, fieldName: keyof CommandField, value: string) => {
    setCommandFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [fieldName]: value } : field
      )
    );
    // Clear specific error on change
    const index = commandFields.findIndex(f => f.id === id);
    setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${fieldName}_${index}`];
        return newErrors;
    });
  };

  const handleAddField = () => {
    setCommandFields((prevFields) => [
      ...prevFields,
      { id: Date.now(), commandstr: "", schemastr: "" },
    ]);
  };

  const handleRemoveField = (id: number) => {
    if (commandFields.length > 1 && !isEdit) {
      setCommandFields((prevFields) => prevFields.filter((field) => field.id !== id));
    }
    // Cannot remove the single field in edit mode
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // For Edit: submit the single modified object
      if (isEdit) {
        const payload = {
          id: defaultValues.id,
          commandId: defaultValues.commandId,
          commandstr: commandFields[0].commandstr,
          schemastr: commandFields[0].schemastr,
        };
        onSubmit(payload);
      } else {
        // For Add: submit an array of new objects, including the parent commandId
        const payload = commandFields.map(f => ({
          commandstr: f.commandstr,
          schemastr: f.schemastr,
        }));
        // The parent component will add the commandId field
        onSubmit(payload);
      }
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4 p-2">
      {/* Read-only Action/Command ID for context */}
      <div className="flex gap-4">
        <div className="space-y-1 w-1/2">
            <Label className="text-sm text-muted-foreground">Action Name</Label>
            <Input value={defaultValues?.action?.actionName || defaultValues?.actionName||'N/A'} disabled className="bg-gray-50 dark:bg-gray-800" />
        </div>
        <div className="space-y-1 w-1/2">
            <Label className="text-sm text-muted-foreground">Command Group ID</Label>
            <Input value={defaultValues.commandId || defaultValues.commandGroupId || 'N/A'} disabled className="bg-gray-50 dark:bg-gray-800" />
        </div>
      </div>
      
      <div className="h-0 border-t border-border mt-4 mb-4"></div>

      {commandFields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border rounded-lg bg-secondary/10 relative"
        >
          <div className="col-span-12 md:col-span-6 space-y-2">
            <Label htmlFor={`commandstr-${field.id}`}>Command String *</Label>
            <Input
              id={`commandstr-${field.id}`}
              placeholder="Enter Command String"
              value={field.commandstr}
              onChange={(e) => handleChange(field.id, "commandstr", e.target.value)}
              disabled={isEdit} // Prevent changing the command string itself in edit mode if it's the primary key
            />
            {errors[`commandstr_${index}`] && <p className="text-sm text-red-500">{errors[`commandstr_${index}`]}</p>}
          </div>

          <div className="col-span-12 md:col-span-6 space-y-2">
            <Label htmlFor={`schemastr-${field.id}`}>Schema String *</Label>
            <Input
              id={`schemastr-${field.id}`}
              placeholder="Enter Schema String"
              value={field.schemastr}
              onChange={(e) => handleChange(field.id, "schemastr", e.target.value)}
            />
            {errors[`schemastr_${index}`] && <p className="text-sm text-red-500">{errors[`schemastr_${index}`]}</p>}
          </div>

          {/* Remove Button (only visible for multiple fields in Add mode) */}
          {!isEdit && commandFields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveField(field.id)}
              className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {/* Add New Button (only visible in Add mode) */}
      {!isEdit && (
        <Button
          type="button"
          onClick={handleAddField}
          variant="outline"
          className="w-full border-dashed border-2 text-primary hover:bg-primary/5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add More Command/Schema Pair
        </Button>
      )}

      {/* Submit button is handled by the CustomModal footer in the parent */}
    </form>
  );
};

export default CommandConfigForm;
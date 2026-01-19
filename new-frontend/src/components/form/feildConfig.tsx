// src/components/FieldConfig.tsx
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField } from "./formFeild";

interface FieldConfigProps {
  field: FormField;
  onUpdate: (id: string, updated: Partial<FormField>) => void;
}

export function FieldConfig({ field, onUpdate }: FieldConfigProps) {
  return (
    <div className="space-y-2">
      <Label>Label</Label>
      <Input
        value={field.label}
        onChange={e => onUpdate(field.id, { label: e.target.value })}
      />
      {field.type !== "checkbox" && field.type !== "radio" && (
        <>
          <Label>Placeholder</Label>
          <Input
            value={field.placeholder || ""}
            onChange={e => onUpdate(field.id, { placeholder: e.target.value })}
          />
        </>
      )}
      {(field.type === "select" || field.type === "radio") && (
        <>
          <Label>Options (comma separated)</Label>
          <Input
            value={field.options?.join(",") || ""}
            onChange={e =>
              onUpdate(field.id, { options: e.target.value.split(",") })
            }
          />
        </>
      )}
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={field.required}
          onCheckedChange={val => onUpdate(field.id, { required: !!val })}
        />
        <Label>Required</Label>
      </div>
    </div>
  );
}
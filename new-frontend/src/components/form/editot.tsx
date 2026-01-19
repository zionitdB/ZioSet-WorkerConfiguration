// src/components/Editor.tsx
import { Button } from "@/components/ui/button";
import { FormField } from "./formFeild";

interface EditorProps {
  fields: FormField[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export function Editor({ fields, onSelect, onRemove }: EditorProps) {
  return (
    <div className="space-y-2">
      {fields.map(field => (
        <div
          key={field.id}
          className="flex items-center justify-between border p-2 rounded cursor-pointer hover:bg-muted"
          onClick={() => onSelect(field.id)}
        >
          <span>{field.label} ({field.type})</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(field.id);
            }}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
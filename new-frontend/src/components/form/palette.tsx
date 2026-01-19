// src/components/Palette.tsx
import { Button } from "@/components/ui/button";

interface PaletteProps {
  onAddField: (type: any) => void;
}

export function Palette({ onAddField }: PaletteProps) {
  const fieldTypes = [
    { type: "input", label: "Input" },
    { type: "textarea", label: "Textarea" },
    { type: "select", label: "Select" },
    { type: "checkbox", label: "Checkbox" },
    { type: "radio", label: "Radio" },
    { type: "date", label: "Date" },
  ];

  return (
    <div className="space-y-2">
      {fieldTypes.map(f => (
        <Button
          key={f.type}
          onClick={() => onAddField(f.type)}
          className="w-full"
        >
          Add {f.label}
        </Button>
      ))}
    </div>
  );
}
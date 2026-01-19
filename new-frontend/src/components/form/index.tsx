// src/App.tsx
import  { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { FormField } from "./formFeild";
import { Palette } from "./palette";
import { FieldConfig } from "./feildConfig";
import { Editor } from "./editot";
import { Preview } from "./preview";

const  DynamicForm = () =>{
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: "New Field",
      placeholder: "",
      options: type === "select" || type === "radio" ? ["Option 1", "Option 2"] : undefined,
      required: false,
    };
    setFields(prev => [...prev, newField]);
  };

  const updateField = (id: string, updated: Partial<FormField>) => {
    setFields(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updated } : f))
    );
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="space-y-4 col-span-1">
        <Palette onAddField={addField} />
        {selectedField && (
          <FieldConfig
            field={selectedField}
            onUpdate={updateField}
          />
        )}
        <Button
          variant="outline"
          onClick={() => {
            const json = JSON.stringify(fields, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "form.json";
            a.click();
          }}
        >
          Export JSON
        </Button>
      </div>
      <div className="col-span-2 border p-4 rounded-md">
        <Editor
          fields={fields}
          onSelect={setSelectedFieldId}
          onRemove={removeField}
        />
      </div>
      <div className="col-span-1 border p-4 rounded-md">
        <h1 className="text-center font-semibold">Preview</h1>
        <Preview fields={fields} />
      </div>
    </div>
  );
}

export default DynamicForm;
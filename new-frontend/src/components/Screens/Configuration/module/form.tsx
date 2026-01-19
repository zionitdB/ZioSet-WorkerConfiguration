import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ModuleFormProps {
  formId: string;
  onSubmit: (data: any) => void;
  defaultValues?: {
    moduleId?: number;
    moduleName?: string;
    active?: boolean;
  };
}

const ModuleForm: React.FC<ModuleFormProps> = ({
  formId,
  onSubmit,
  defaultValues,
}) => {
  const [formData, setFormData] = useState({
    moduleId: 0,
    moduleName: "",
    active: true,
  });

  /** ✅ Only run when editing (defaultValues exists) */
  useEffect(() => {
    if (!defaultValues) return;

    setFormData({
      moduleId: defaultValues.moduleId ?? 0,
      moduleName: defaultValues.moduleName ?? "",
      active: defaultValues.active ?? true,
    });
  }, [
    defaultValues?.moduleId,
    defaultValues?.moduleName,
    defaultValues?.active,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Module Name</Label>
          <Input
            required
            value={formData.moduleName}
            placeholder="Enter module name"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                moduleName: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <Label>Active</Label>
          <Switch
            checked={formData.active}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                active: checked,
              }))
            }
          />
        </div>
      </div>
    </form>
  );
};

export default ModuleForm;

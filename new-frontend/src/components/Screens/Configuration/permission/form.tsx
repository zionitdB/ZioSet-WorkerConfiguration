import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { CategoryJson } from "../CategoryJson";
import { useGetModules } from "./hooks";

type CategoryKey = keyof typeof CategoryJson;

interface Permission {
  permissionsName: string;
  navigationUrl: string;
  actions?: string[];
}

interface Module {
  moduleId: number;
  moduleName: string;
}

interface AddUserDialogProps {
  formId: string;
  onSubmit: (formData: any) => void;
  defaultValues?: any;
}

const PermissionForm: React.FC<AddUserDialogProps> = ({
  onSubmit,
  formId,
  defaultValues,
}) => {
  /** 🔹 GET MODULE LIST */
  const { data: modules = [] } = useGetModules();

  /** 🔹 FORM STATE */
  const [formData, setFormData] = useState({
    moduleId: defaultValues?.module?.moduleId ?? "",
    category: defaultValues?.category ?? "",
    permissionsName: defaultValues?.permissionsName ?? "",
    navigationUrl: defaultValues?.navigationUrl ?? "",
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const categories: CategoryKey[] = Object.keys(CategoryJson) as CategoryKey[];

  /** 🔹 Update permissions when category changes */
  useEffect(() => {
    if (formData.category) {
      setPermissions(CategoryJson[formData.category as CategoryKey] || []);
    } else {
      setPermissions([]);
    }
  }, [formData.category]);

  /** 🔹 Auto-fill navigation URL */
  useEffect(() => {
    const selectedPermission = permissions.find(
      (perm) => perm.permissionsName === formData.permissionsName
    );

    if (selectedPermission) {
      setFormData((prev) => ({
        ...prev,
        navigationUrl: selectedPermission.navigationUrl,
      }));
    }
  }, [formData.permissionsName, permissions]);

  /** 🔹 SUBMIT */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      category: formData.category,
      permissionsName: formData.permissionsName,
      navigationUrl: formData.navigationUrl,
      module: {
        moduleId: Number(formData.moduleId),
      },
      active: 1,
    };

    onSubmit(payload);

    setFormData({
      moduleId: "",
      category: "",
      permissionsName: "",
      navigationUrl: "",
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

          {/* 🔹 MODULE DROPDOWN */}
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={String(formData.moduleId)}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, moduleId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <span>
                  {formData.moduleId
                    ? modules.find(
                        (m: Module) => m.moduleId === Number(formData.moduleId)
                      )?.moduleName
                    : "Select Module"}
                </span>
              </SelectTrigger>
              <SelectContent className="max-h-48 w-full overflow-auto">
                {modules.map((module: Module) => (
                  <SelectItem
                    key={module.moduleId}
                    value={String(module.moduleId)}
                  >
                    {module.moduleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🔹 CATEGORY */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full">
                <span>{formData.category || "Select Category"}</span>
              </SelectTrigger>
              <SelectContent className="max-h-48 w-full overflow-auto">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🔹 PERMISSION */}
          <div className="space-y-2">
            <Label>Permission</Label>
            <Select
              value={formData.permissionsName}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, permissionsName: value }))
              }
              disabled={!formData.category}
            >
              <SelectTrigger className="w-full">
                <span>
                  {formData.permissionsName || "Select Permission"}
                </span>
              </SelectTrigger>
              <SelectContent className="max-h-48 w-full overflow-auto">
                {permissions.map((permission) => (
                  <SelectItem
                    key={permission.permissionsName}
                    value={permission.permissionsName}
                  >
                    {permission.permissionsName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🔹 NAVIGATION URL */}
          <div className="space-y-2">
            <Label>Navigation URL</Label>
            <Input
              value={formData.navigationUrl}
              placeholder="Navigation URL"
              disabled
            />
          </div>

        </div>
      </div>
    </form>
  );
};

export default PermissionForm;

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetCategoriesDropdown } from "./hooks";

interface CategoryFormProps {
  formId: string;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  formId,
  defaultValues = {},
}) => {
const [formData, setFormData] = useState({
  id: defaultValues?.id ?? 0,
  categoryname: defaultValues?.categoryname || "",
  parrentCategory: defaultValues?.parrentCategory?.id || null,
  active: defaultValues?.active ?? 1,
});


  const [errors, setErrors] = useState<any>({});
  const { data: categoriesDropdown = [] } = useGetCategoriesDropdown();

  const validate = () => {
    const newErrors: any = {};
    if (!formData.categoryname.trim()) newErrors.categoryname = "Category Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload: any = { ...formData };
      if (!formData.id) delete payload.id; // Remove ID for new categories
      onSubmit(payload);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-2">
      {/* Category Name */}
      <div className="space-y-2">
        <Label>Category Name *</Label>
        <Input
          placeholder="Enter Category Name"
          value={formData.categoryname}
          onChange={(e) => handleChange("categoryname", e.target.value)}
        />
        {errors.categoryname && <p className="text-sm text-red-500">{errors.categoryname}</p>}
      </div>

      {/* Parent Category */}
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select
          value={formData.parrentCategory || ""}
          onValueChange={(val) => handleChange("parrentCategory", Number(val))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Parent Category" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value={""}>None</SelectItem> */}
            {categoriesDropdown.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.categoryname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active */}
      <div className="flex items-center gap-2 mt-2">
        <Label>Active</Label>
        <Switch
          checked={!!formData.active}
          onCheckedChange={(val) => handleChange("active", val ? 1 : 0)}
        />
      </div>
    </form>
  );
};

export default CategoryForm;

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  defaultValues = null,
}) => {
  const { data: categoriesDropdown = [] } = useGetCategoriesDropdown();

  /* ---------------- STATE ---------------- */
  const [category, setCategory] = useState<string>("none");
  const [categoryName, setCategoryName] = useState<string>("");
  const [isSubCategory, setIsSubCategory] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  /* ---------------- PREFILL (EDIT MODE) ---------------- */
  useEffect(() => {
    if (defaultValues) {
      setCategory(
        defaultValues?.parrentCategory?.id
          ? String(defaultValues.parrentCategory.id)
          : "none"
      );
      setCategoryName(defaultValues.categoryname || "");
    } else {
      setCategory("none");
      setCategoryName("");
    }
  }, [defaultValues]);

  /* ---------------- SUB CATEGORY FLAG ---------------- */
  useEffect(() => {
    setIsSubCategory(category !== "none");
  }, [category]);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors: any = {};

    if (!categoryName.trim()) {
      newErrors.categoryname = isSubCategory
        ? "Enter Sub Category Name"
        : "Enter New Category Name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload: any = {
      ...(defaultValues?.id ? { id: defaultValues.id } : {}),
      categoryname: categoryName,
    };

    if (category !== "none") {
      payload.parrentCategory = { id: Number(category) };
    }

    onSubmit(payload);
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-4 p-2"
    >
      {/* CATEGORY NAME */}
      <div className="space-y-2">
        <Label>
          {isSubCategory ? "Sub Category Name *" : "Category Name *"}
        </Label>
        <Input
          placeholder={
            isSubCategory ? "Enter Sub Category Name" : "Enter Category Name"
          }
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value);
            setErrors({});
          }}
        />
        {errors.categoryname && (
          <p className="text-sm text-red-500">{errors.categoryname}</p>
        )}
      </div>

      {/* PARENT CATEGORY */}
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select
          key={category}
          value={category}
          onValueChange={(val) => setCategory(val)}
          disabled={!!defaultValues}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select Category</SelectItem>
            {categoriesDropdown.map((cat: any) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.categoryname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default CategoryForm;

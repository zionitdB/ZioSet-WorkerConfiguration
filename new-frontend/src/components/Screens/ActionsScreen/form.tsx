import React, { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useGetCategories, useGetSubCategories } from "./hooks";

interface Category {
  id: number;
  categoryname: string;
}

interface ActionFormValues {
  id?: number;
  actionName: string;
  informationtype: string;
  informationdetail: string;
  category?: Category;
  subCategory?: Category;
}

interface ActionFormProps {
  formId: string;
  defaultValues?: ActionFormValues;
  onSubmit: (data: ActionFormValues) => void;
}

const ActionForm: React.FC<ActionFormProps> = ({
  formId,
  defaultValues,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    actionName: defaultValues?.actionName || "",
    infoType: defaultValues?.informationtype || "",
    infoDetails: defaultValues?.informationdetail || "",
  });

  const [category, setCategory] = useState<string>(
    defaultValues?.category?.id.toString() || ""
  );
  const [subCategory, setSubCategory] = useState<string>(
    defaultValues?.subCategory?.id.toString() || "none"
  );

  const { data: categories = [] } = useGetCategories(); 
  const getSub = useGetSubCategories(); 

  useEffect(() => {
    if (defaultValues) {
      setFormData({
        actionName: defaultValues.actionName || "",
        infoType: defaultValues.informationtype || "",
        infoDetails: defaultValues.informationdetail || "",
      });

      setCategory(defaultValues.category?.id.toString() || "none");
      setSubCategory(defaultValues.subCategory?.id.toString() || "none");

      if (defaultValues.category?.id) {
        getSub.mutate(defaultValues.category.id);
      }
    } else {
      setFormData({ actionName: "", infoType: "", infoDetails: "" });
      setCategory("none");
      setSubCategory("none");
    }
  }, [defaultValues]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSubCategory("none");
    if (val !== "none") getSub.mutate(Number(val));
  };

  const validate = (): boolean => {
    if (!formData.actionName.trim()) {
      toast.error("Enter Action Name");
      return false;
    }
    if (category === "none") {
      toast.error("Select Category");
      return false;
    }
    if (!formData.infoType.trim()) {
      toast.error("Enter Information Type");
      return false;
    }
    if (!formData.infoDetails.trim()) {
      toast.error("Enter Information Details");
      return false;
    }
    return true;
  };

  /* Form submit */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: ActionFormValues = {
      ...(defaultValues?.id ? { id: defaultValues.id } : {}),
      actionName: formData.actionName,
      informationtype: formData.infoType,
      informationdetail: formData.infoDetails,
      category: { id: Number(category), categoryname: "" },
      ...(subCategory === "none"
        ? {}
        : { subCategory: { id: Number(subCategory), categoryname: "" } }),
    };

    onSubmit(payload);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
  
      <div className="space-y-2 col-span-2">
        <Label>Action Name *</Label>
        <Input
          value={formData.actionName}
          placeholder="Action Name here..."
          onChange={(e) =>
            setFormData({ ...formData, actionName: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Category *</Label>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c:any) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.categoryname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sub Category</Label>
        <Select value={subCategory} onValueChange={setSubCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Sub Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {getSub.data?.map((s: Category) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.categoryname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Information Type */}
      <div className="space-y-2">
        <Label>Information Type *</Label>
        <Input
          value={formData.infoType}
          placeholder="Information Type here..."
          onChange={(e) =>
            setFormData({ ...formData, infoType: e.target.value })
          }
        />
      </div>

      {/* Information Details */}
      <div className="col-span-2 space-y-2">
        <Label>Information Details *</Label>
        <Input
          value={formData.infoDetails}
          placeholder="Information Details here..."
          onChange={(e) =>
            setFormData({ ...formData, infoDetails: e.target.value })
          }
        />
      </div>
    </form>
  );
};

export default ActionForm;

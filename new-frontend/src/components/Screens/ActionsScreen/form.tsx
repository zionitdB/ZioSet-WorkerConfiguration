import { useState } from "react";
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

const ActionForm = ({ onSubmit, formId, defaultValues }: any) => {
  const [formData, setFormData] = useState({
    actionName: defaultValues?.actionName || "",
    infoType: defaultValues?.informationtype || "",
    infoDetails: defaultValues?.informationdetail || "",
  });

  const [category, setCategory] = useState(
    defaultValues?.category?.id || "none"
  );
  const [subCategory, setSubCategory] = useState(
    defaultValues?.subCategory?.id || "none"
  );

  const { data: categories = [] } = useGetCategories();
  const getSub = useGetSubCategories();

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSubCategory("none");
    getSub.mutate(Number(val));
  };

  const validate = () => {
    if (!formData.actionName.trim()) return toast.error("Enter Action Name");
    if (category === "none") return toast.error("Select Category");
    if (!formData.infoType.trim()) return toast.error("Enter Information Type");
    if (!formData.infoDetails.trim())
      return toast.error("Enter Information Details");
    return true;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...(defaultValues?.id ? { id: defaultValues.id } : {}),
      category: { id: category },
      ...(subCategory === "none" ? {} : { subCategory: { id: subCategory } }),
      informationtype: formData.infoType,
      informationdetail: formData.infoDetails,
      actionName: formData.actionName,
    };

    onSubmit(payload);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Action Name *</Label>
        <Input
          value={formData.actionName}
          placeholder="Action Name here...."
          onChange={(e) =>
            setFormData({ ...formData, actionName: e.target.value })
          }
        />
      </div>

    <div className="space-y-2">
        <Label>Category *</Label>
        <Select value={category.toString()} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c: any) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.categoryname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sub Category</Label>
        <Select
          value={subCategory.toString()}
          onValueChange={setSubCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Sub Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {getSub.data?.map((s: any) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.categoryname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Information Type *</Label>
        <Input
          value={formData.infoType}
          placeholder="Information type here...."
          onChange={(e) =>
            setFormData({ ...formData, infoType: e.target.value })
          }
        />
      </div>

      <div className="col-span-2 space-y-2">
        <Label>Information Details *</Label>
        <Input
          value={formData.infoDetails}
             placeholder="Information Details here...."
          onChange={(e) =>
            setFormData({ ...formData, infoDetails: e.target.value })
          }
        />
      </div>

    </form>
  );
};

export default ActionForm;

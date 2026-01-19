import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AppFormProps {
  formId: string;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const StandaloneAppForm: React.FC<AppFormProps> = ({
  onSubmit,
  formId,
  defaultValues = {},
}) => {
  const [formData, setFormData] = useState({
    id: defaultValues.id || 0,
    standaloneApplicationName: defaultValues.standaloneApplicationName || "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.standaloneApplicationName.trim()) newErrors.standaloneApplicationName = "Application Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4 p-2">
      <div className="space-y-2">
        <Label>Application Name *</Label>
        <Input
          placeholder="Enter Application Name"
          value={formData.standaloneApplicationName}
          onChange={(e) => setFormData({ ...formData, standaloneApplicationName: e.target.value })}
        />
        {errors.standaloneApplicationName && <p className="text-sm text-red-500">{errors.standaloneApplicationName}</p>}
      </div>
    </form>
  );
};

export default StandaloneAppForm;
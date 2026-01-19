
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddUserDialogProps {
  formId: string;
  onSubmit: (formData: any) => void;
  defaultValues?: any;
}

const RoleForm: React.FC<AddUserDialogProps> = ({
  onSubmit,
  formId,
  defaultValues = {},
}) => {
  const [formData, setFormData] = useState({
    roleName: defaultValues.roleName || "",
  });
  const [validationErrors, setValidationErrors] = useState<any>({});
  useEffect(() => {
    setFormData({
      roleName: defaultValues.roleName || "",
    });
  }, [defaultValues]);

  
  const validateForm = () => {
    const errors: any = {};

    if (!formData.roleName) errors.roleName = "Role Name is required";
 
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(validateForm()){
    onSubmit(formData);
    setFormData({
      roleName: "",
    });

      setValidationErrors({});
  }
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label> Name</Label>
            <Input
             type="text"
              required
              value={formData.roleName}
              placeholder="Enter Name"
              onChange={(e) =>
                setFormData({ ...formData, roleName: e.target.value })
              }
            />
              {validationErrors.roleName && (
              <p className="text-red-500 text-sm">{validationErrors.roleName}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default RoleForm;

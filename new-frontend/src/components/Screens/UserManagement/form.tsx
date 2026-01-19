import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRoles } from "./hooks";

interface UserFormProps {
  formId: string;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  formId,
  defaultValues = {},
}) => {
  const { data: roles = [] } = useGetRoles();
  const isEditMode = !!defaultValues?.userId;

  const [formData, setFormData] = useState({
    userId: defaultValues.userId || 0,
    username: defaultValues.username || "",
    password: "", 
    firstName: defaultValues.firstName || "",
    lastName: defaultValues.lastName || "",
    email: defaultValues.email || "",
    active: defaultValues.active ?? 1,
    roleId: defaultValues.role?.roleId || "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const e: any = {};
    if (!formData.username.trim()) e.username = "Username is required";
    if (!isEditMode && !formData.password.trim())
      e.password = "Password is required";
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    if (!formData.roleId) e.role = "Role is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev: any) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let payload: any;

    if (isEditMode) {
      // ✅ UPDATE payload
      payload = {
        userId: formData.userId,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        active: formData.active,
        role: {
          roleId: Number(formData.roleId),
        },
      };
    } else {

      payload = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roleId: Number(formData.roleId),
        active: formData.active,
      };
    }

    onSubmit(payload);
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-4 p-2"
    >
      {/* Username */}
      <div className="space-y-2">
        <Label>Username *</Label>
        <Input
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />
        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
      </div>

      {/* Password – ONLY ADD */}
      {!isEditMode && (
        <div className="space-y-2">
          <Label>Password *</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>
      )}

      {/* First Name */}
      <div className="space-y-2">
        <Label>First Name *</Label>
        <Input
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label>Last Name *</Label>
        <Input
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Email *</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label>Role *</Label>
        <Select
          value={formData.roleId?.toString()}
          onValueChange={(v) => handleChange("roleId", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r: any) => (
              <SelectItem key={r.roleId} value={r.roleId.toString()}>
                {r.roleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      {/* Active */}
      <div className="flex items-center gap-3 mt-4">
        <Label>Active</Label>
        <Switch
          checked={!!formData.active}
          onCheckedChange={(v) => handleChange("active", v ? 1 : 0)}
        />
      </div>
    </form>
  );
};

export default UserForm;

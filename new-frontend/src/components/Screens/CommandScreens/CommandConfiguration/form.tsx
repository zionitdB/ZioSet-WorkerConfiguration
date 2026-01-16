"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useGetActions } from "./hooks";
import { Button } from "@/components/ui/button";

interface CommandFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const CommandForm: React.FC<CommandFormProps> = ({ onSubmit, defaultValues = {} }) => {
  const [formData, setFormData] = useState({
    actionId: defaultValues?.action?.id || "",
    commandId: defaultValues?.commandId || "",
    commandstr: defaultValues?.commandstr || "",
    schemastr: defaultValues?.schemastr || "",
  });

  const { data: actions = [] } = useGetActions();

  const handleChange = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-3">
      <div className="space-y-2">
        <Label>Action *</Label>
        <Select
          value={formData.actionId + ""}
          onValueChange={(val) => handleChange("actionId", Number(val))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Action" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((act: any) => (
              <SelectItem key={act.id} value={act.id + ""}>
                {act.actionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Command ID *</Label>
        <Input
          placeholder="Enter Command ID"
          value={formData.commandId}
          onChange={(e) => handleChange("commandId", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Command String *</Label>
        <Input
          placeholder="Command String"
          value={formData.commandstr}
          onChange={(e) => handleChange("commandstr", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Schema String *</Label>
        <Input
          placeholder="Schema String"
          value={formData.schemastr}
          onChange={(e) => handleChange("schemastr", e.target.value)}
        />
      </div>

      <Button type="submit" className="mt-2">
        Save
      </Button>
    </form>
  );
};

export default CommandForm;

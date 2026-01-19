// src/components/Preview.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField } from "./formFeild";

interface PreviewProps {
  fields: FormField[];
}

export function Preview({ fields }: PreviewProps) {
  return (
    <form className="space-y-4">
      {fields.map(field => (
        <div key={field.id} className="space-y-1">
          <Label>{field.label}</Label>
          {field.type === "input" && <Input placeholder={field.placeholder} required={field.required} />}
          {field.type === "textarea" && <Textarea placeholder={field.placeholder} required={field.required} />}
          {field.type === "select" && (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt, i) => (
                  <SelectItem key={i} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {field.type === "checkbox" && (
            <div className="flex items-center space-x-2">
              <Checkbox id={field.id} />
              <Label htmlFor={field.id}>{field.label}</Label>
            </div>
          )}
          {field.type === "radio" && (
            <div className="space-y-1">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="radio" name={field.id} value={opt} />
                  <Label>{opt}</Label>
                </div>
              ))}
            </div>
          )}
          {field.type === "date" && <Input type="date" required={field.required} />}
        </div>
      ))}
    </form>
  );
}
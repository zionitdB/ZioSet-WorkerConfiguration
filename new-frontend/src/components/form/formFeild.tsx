export interface FormField {
  id: string;
  type: "input" | "textarea" | "select" | "checkbox" | "radio" | "date";
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
}
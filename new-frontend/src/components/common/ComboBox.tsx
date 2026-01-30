import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxProps {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function ComboboxDropdown({
  options,
  value,
  onChange,
  placeholder,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left"
        >
          {selectedLabel || placeholder || "Select..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full min-w-80 p-0 shadow-xl">
        <Command>
          {/* Search only */}
          <CommandInput
            placeholder="Search script..."
            className="h-10"
          />

          {/* Scrollable list */}
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No result found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}   // search by label
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="font-medium">
                      {option.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        value === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>

                  {option.description && (
                    <small className="text-muted-foreground text-xs line-clamp-2">
                      {option.description}
                    </small>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

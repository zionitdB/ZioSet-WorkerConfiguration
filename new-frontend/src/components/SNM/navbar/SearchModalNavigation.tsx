

import { useAuth } from "@/components/context/auth-context";
import { useGetPermissionsAndActionsByRole } from "@/components/Screens/Configuration/rolepermission/hook";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type NavItem = {
  name: string;
  href: string;
  section: string;
};

const SearchCommandDialog = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const [roleId, setRoleId] = useState<string | null>(null);
  const { user } = useAuth();
  const { data } = useGetPermissionsAndActionsByRole(roleId);

  useEffect(() => {
    if (user) setRoleId(user.role?.role_id || null);
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isK = e.key.toLowerCase() === "k";

      if ((isMac && e.metaKey && isK) || (!isMac && e.ctrlKey && isK)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  const links: NavItem[] = useMemo(() => {
    if (!data) return [];

    const sections = [
      "dashboardPermission",
      "machinemasterPermission",
      "assetmasterPermission",
      "emsmasterPermission",
      "breakdownPermission",
      "maintenanceofmachinePermission",
      "transactionPermission",
      "reportPermission",
      "itreportPermission",
      "emsreportPermission",
      "configurationPermission",
    ];

    const allPermissions = sections.flatMap((section) => data[section] || []);

    return allPermissions
      .filter((item: any) => item.selected)
      .map((item: any) => ({
        name: item.permissionsName,
        href: item.navigationUrl,
        section: item.category || "Other",
      }));
  }, [data]);

  const handleSelect = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const grouped = links.reduce<Record<string, NavItem[]>>((acc, item) => {
    const section = item.section || "Pages";
    acc[section] = acc[section] || [];
    acc[section].push(item);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl w-full">
        <DialogTitle className="sr-only">Search Permissions</DialogTitle>
        <Command className="rounded-lg border shadow-md w-full">
          <CommandInput placeholder="Type a command or search..." className="px-4 py-2" />
          <CommandList className="max-h-[70vh] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(grouped).map(([section, items], idx) => (
              <div key={section}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={section}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.href}
                      onSelect={() => handleSelect(item.href)}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span>{item.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchCommandDialog;

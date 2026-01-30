import { usePermissions } from "@/components/context/permission-context";
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
import { ArrowRight, Folder } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type NavItem = {
  name: string;
  href?: string;
  section: string;
  isModule?: boolean;
  moduleName?: string;
};

const SearchCommandDialog = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routes } = usePermissions();

  const normalize = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");

  const moduleKeyFromUrl = location.pathname
    .split("/")
    .filter(Boolean)[0]
    ?.toLowerCase();

 
  const activeModuleName = useMemo(() => {
    if (!routes?.modules || !moduleKeyFromUrl) return null;

    for (const moduleName of Object.keys(routes.modules)) {
      if (normalize(moduleName) === moduleKeyFromUrl) {
        return moduleName;
      }
    }
    return null;
  }, [routes, moduleKeyFromUrl]);


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes("Mac");
      if ((isMac && e.metaKey && e.key === "k") || (!isMac && e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);


  const getFirstRouteOfModule = (moduleData: any): string | null => {
  if (!moduleData) return null;

  for (const category of Object.values(moduleData)) {
    for (const item of category as any[]) {
      if (item.selected && item.navigationUrl) {
        return item.navigationUrl;
      }
    }
  }

  return null;
};


  const items: NavItem[] = useMemo(() => {
    if (!routes?.modules) return [];

if (!activeModuleName) {
  return Object.entries(routes.modules).map(([moduleName, moduleData]: any) => {
    const firstRoute = getFirstRouteOfModule(moduleData);

    return {
      name: moduleName,
      section: "Modules",
      isModule: true,
      moduleName,
      href: firstRoute || "/",   // 👈 real working route
    };
  });
}


    const result: NavItem[] = [];
  const categories = routes.modules[activeModuleName as keyof typeof routes.modules];


    Object.values(categories).forEach((items: any) => {
      items.forEach((item: any) => {
        if (item.selected && item.navigationUrl) {
          result.push({
            name: item.permissionsName,
            href: item.navigationUrl,
            section: activeModuleName,
          });
        }
      });
    });

    return result;
  }, [routes, activeModuleName]);


  const grouped = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section].push(item);
    return acc;
  }, {});


  const handleSelect = (item: NavItem) => {
    setOpen(false);


    if (item.isModule && item.moduleName) {
      navigate(item.href || "/", {
        state: {
          moduleName: item.moduleName,
          moduleData: routes.modules[item.moduleName as keyof typeof routes.modules]

        },
      });
      return;
    }

    /* If page clicked */
    if (item.href) {
      navigate(item.href);
    }
  };

  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl w-full">
        <DialogTitle className="sr-only">Search</DialogTitle>

        <Command className="rounded-lg border shadow-md w-full">
          <CommandInput
            placeholder={
              activeModuleName
                ? `Search in ${activeModuleName}...`
                : "Search modules..."
            }
            className="px-4 py-2"
          />

          <CommandList className="max-h-[70vh] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>

            {Object.entries(grouped).map(([section, items], idx) => (
              <div key={section}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={section}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.name}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50"
                    >
                      {item.isModule ? (
                        <Folder className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{item.name}</span>
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

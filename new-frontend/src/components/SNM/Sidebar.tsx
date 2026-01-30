





// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiChevronDown, FiLogOut, FiUser, FiSearch, FiX, FiChevronRight } from "react-icons/fi";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Input } from "@/components/ui/input";
// import sidebarData from "./SidebarData";

// // --- Types ---
// type SubLink = { label: string; path: string };
// type NavItem = {
//   label: string;
//   path: string;
//   icon: React.ReactNode;
//   subLinks?: SubLink[];
// };
// type NavSection = { 
//   title: string; 
//   items: NavItem[];
//   collapsible?: boolean;
// };
// type SidebarData = Record<string, NavSection[]>;

// type SidebarProps = {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [selectedItem, setSelectedItem] = useState<string | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

//   const pathSegments = location.pathname.split("/").filter(Boolean);
//   const sidebarKey = pathSegments[0] || "agentManagement";
//   const rawSections: NavSection[] = (sidebarData as SidebarData)[sidebarKey] || [];

//   // Search Logic
//   const navSections = useMemo(() => {
//     if (!searchQuery) return rawSections;
//     return rawSections.map(section => ({
//       ...section,
//       items: section.items.filter(item => 
//         item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.subLinks?.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase()))
//       )
//     })).filter(section => section.items.length > 0);
//   }, [searchQuery, rawSections]);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const currentPath = location.pathname.toLowerCase();
//     let foundLabel: string | null = null;
//     let foundDropdown: string | null = null;

//     rawSections.forEach((section) => {
//       section.items.forEach((item) => {
//         if (item.path.toLowerCase() === currentPath) foundLabel = item.label;
//         item.subLinks?.forEach((sub) => {
//           if (sub.path.toLowerCase() === currentPath) {
//             foundLabel = sub.label;
//             foundDropdown = item.label;
//           }
//         });
//       });
//     });

//     setSelectedItem(foundLabel);
//     if (foundDropdown && isOpen) setOpenDropdown(foundDropdown);
//   }, [location.pathname, rawSections, isOpen]);

//   const handleItemClick = (label: string, path: string) => {
//     setSelectedItem(label);
//     navigate(path);
//     if (isMobile) setIsOpen(false);
//   };

//   const toggleSection = (title: string) => {
//     const newCollapsed = new Set(collapsedSections);
//     if (newCollapsed.has(title)) {
//       newCollapsed.delete(title);
//     } else {
//       newCollapsed.add(title);
//     }
//     setCollapsedSections(newCollapsed);
//   };

//   return (
//     <motion.div
//       initial={false}
//       animate={{ width: isOpen ? (isMobile ? "280px" : "260px") : isMobile ? "0px" : "80px" }}
//       className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border/40 shadow transition-all duration-300 ease-in-out ${
//         !isMobile ? "relative" : isOpen ? "translate-x-0" : "-translate-x-full"
//       }`}
//     >
//       {/* --- HEADER & SEARCH --- */}
//       <div className="shrink-0 pt-1 px-4 space-y-4 border-b border-border/40 pb-3">
//         {/* Search Input */}
//         <div className="relative group px-1">
//           <FiSearch className={`absolute z-10 top-1/2 -translate-y-1/2 text-muted-foreground transition-all ${isOpen ? "left-4 w-4 h-4" : "left-5 w-5 h-5"}`} />
//           {isOpen ? (
//             <div className="relative">
//               <Input
//                 placeholder="Search menu..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9 pr-8 h-10 bg-accent/30 border-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl text-sm"
//               />
//               <AnimatePresence>
//                 {searchQuery && (
//                   <motion.button
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     <FiX className="w-3.5 h-3.5" />
//                   </motion.button>
//                 )}
//               </AnimatePresence>
//             </div>
//           ) : (
//             <div onClick={() => setIsOpen(true)} className="h-10 w-full cursor-pointer rounded-xl hover:bg-accent/50 flex items-center justify-center transition-colors" />
//           )}
//         </div>
//       </div>

//       {/* --- SCROLLABLE CONTENT --- */}
//       <div className="flex-1 overflow-hidden">
//         <ScrollArea className="h-full">
//           <nav className="p-3 space-y-1">
//             {navSections.map((section) => {
//               const isSectionCollapsed = collapsedSections.has(section.title);
//               const isCollapsible = section.collapsible;

//               return (
//                 <div key={section.title} className="space-y-1">
//                   {/* Section Header - Jenkins Style */}
//                   {isOpen && (
//                     <div
//                       onClick={() => isCollapsible && toggleSection(section.title)}
//                       className={`flex items-center justify-between px-3 py-2 ${
//                         isCollapsible 
//                           ? 'cursor-pointer hover:bg-accent/40 rounded-lg transition-colors' 
//                           : ''
//                       }`}
//                     >
//                       <h4 className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
//                         {section.title}
//                       </h4>
//                       {isCollapsible && (
//                         <motion.div
//                           animate={{ rotate: isSectionCollapsed ? 0 : 90 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           <FiChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
//                         </motion.div>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* Section Items with Animation */}
//                   <AnimatePresence initial={false}>
//                     {(!isSectionCollapsed || !isOpen) && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.2, ease: "easeInOut" }}
//                         className="space-y-0.5 overflow-hidden"
//                       >
//                         {section.items.map((item) => {
//                           const isDropdownActive = item.subLinks?.some(s => s.label === selectedItem);
//                           const isActive = selectedItem === item.label || isDropdownActive;
//                           const isDropdownOpen = openDropdown === item.label;

//                           return (
//                             <div key={item.label} className="relative px-1">
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <div
//                                     onClick={() => item.subLinks ? (isOpen ? setOpenDropdown(isDropdownOpen ? null : item.label) : setIsOpen(true)) : handleItemClick(item.label, item.path)}
//                                     className={`group relative flex items-center h-10 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
//                                       isActive
//                                         ? "bg-primary/15 text-primary shadow-sm border-l-2 border-primary"
//                                         : "text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:border-l-2 hover:border-accent-foreground/20"
//                                     }`}
//                                   >
//                                     <div className={`flex items-center justify-center shrink-0 ${isOpen ? "mr-3" : "mx-auto"}`}>
//                                       <span className={`text-[17px] ${isActive ? "text-primary" : ""}`}>{item.icon}</span>
//                                     </div>
//                                     {isOpen && (
//                                       <span className="flex-1 text-[13px] font-medium truncate">
//                                         {item.label}
//                                       </span>
//                                     )}
//                                     {isOpen && item.subLinks && (
//                                       <motion.div
//                                         animate={{ rotate: isDropdownOpen ? 180 : 0 }}
//                                         transition={{ duration: 0.2 }}
//                                       >
//                                         <FiChevronDown className="w-4 h-4" />
//                                       </motion.div>
//                                     )}
//                                   </div>
//                                 </TooltipTrigger>

//                                 {/* COLLAPSED HOVER CARD */}
//                                 {!isOpen && (
//                                   <TooltipContent side="right" sideOffset={15} className="p-0 border-none bg-transparent shadow-none">
//                                     <div className="bg-popover border border-border/50 rounded-xl overflow-hidden min-w-[200px] shadow-2xl">
//                                       <div className="px-4 py-3 bg-accent/50 border-b border-border/50">
//                                         <p className="font-bold text-[13px] text-foreground flex items-center gap-2">
//                                           <span className="text-primary">{item.icon}</span>
//                                           {item.label}
//                                         </p>
//                                       </div>
//                                       {item.subLinks && (
//                                         <div className="p-1.5 bg-popover">
//                                           {item.subLinks.map(sub => (
//                                             <div 
//                                               key={sub.label} 
//                                               onClick={() => handleItemClick(sub.label, sub.path)}
//                                               className={`px-3 py-2 text-[12.5px] rounded-lg transition-colors cursor-pointer mb-0.5 ${
//                                                 selectedItem === sub.label 
//                                                   ? "bg-primary/10 text-primary font-semibold" 
//                                                   : "hover:bg-accent hover:text-foreground text-muted-foreground"
//                                               }`}
//                                             >
//                                               {sub.label}
//                                             </div>
//                                           ))}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </TooltipContent>
//                                 )}
//                               </Tooltip>

//                               {/* EXPANDED SUBLINKS - Jenkins Style */}
//                               <AnimatePresence>
//                                 {isOpen && item.subLinks && isDropdownOpen && (
//                                   <motion.div 
//                                     initial={{ height: 0, opacity: 0 }} 
//                                     animate={{ height: "auto", opacity: 1 }} 
//                                     exit={{ height: 0, opacity: 0 }}
//                                     transition={{ duration: 0.2, ease: "easeInOut" }}
//                                     className="overflow-hidden ml-8 mt-1 pl-3 border-l-2 border-border/50 space-y-0.5"
//                                   >
//                                     {item.subLinks.map((sub) => (
//                                       <div
//                                         key={sub.label}
//                                         onClick={() => handleItemClick(sub.label, sub.path)}
//                                         className={`py-2 px-3 text-[12.5px] cursor-pointer rounded-md transition-all ${
//                                           selectedItem === sub.label 
//                                             ? "text-primary font-semibold bg-primary/10 border-l-2 border-primary" 
//                                             : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
//                                         }`}
//                                       >
//                                         {sub.label}
//                                       </div>
//                                     ))}
//                                   </motion.div>
//                                 )}
//                               </AnimatePresence>
//                             </div>
//                           );
//                         })}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             })}
//           </nav>
//         </ScrollArea>
//       </div>

//       {/* --- FOOTER --- */}
//       <div className="p-4 shrink-0 border-t border-border/40 bg-background">
//         <div className={`flex items-center ${isOpen ? "gap-3 px-2" : "justify-center"} py-2.5 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-colors`}>
//           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
//             <FiUser className="w-4 h-4" />
//           </div>
//           {isOpen && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
//               <p className="text-[13px] font-bold truncate leading-none mb-1">Divakar Barhate</p>
//               <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Administrator</p>
//             </motion.div>
//           )}
//           {isOpen && (
//             <button className="p-2 hover:bg-background/80 rounded-xl text-muted-foreground hover:text-destructive transition-colors">
//               <FiLogOut className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;






















import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiLogOut, FiUser, FiSearch, FiX, FiChevronRight } from "react-icons/fi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  FiHome,
  FiSettings,
  FiUsers,
  FiFolder,
  FiFile,
  FiActivity,
} from "react-icons/fi";
import { BiWindow } from "react-icons/bi";
import { Apple, Bot, File, LayoutGrid, Replace, School, ShieldCheck } from "lucide-react";


import {  Users, Activity, Layers } from "lucide-react";
import { MdApproval, MdSupportAgent } from "react-icons/md";
import { usePermissions } from "../context/permission-context";

type SubLink = { label: string; path: string };
type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  subLinks?: SubLink[];
};
type NavSection = { 
  title: string; 
  items: NavItem[];
  collapsible?: boolean;
};

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export const DefaultIcon = <FiChevronRight className="w-4 h-4" />;

export const iconMap: Record<string, React.ReactNode> = {
  // General
  dashboard: <FiHome />,
  settings: <FiSettings />,
  users: <FiUsers />,
  folder: <FiFolder />,
  file: <FiFile />,
  activity: <FiActivity />,

  "category": <School />,
  "actions": <Activity />,
  "agent update": <MdSupportAgent />,
  "commands": <Users />,
  "standalone application": <Layers />,
  "installed systems": <BiWindow />,
  "unregistered assets": <Apple />,
  "script management": <Bot />,
  "agent dashboard": <LayoutGrid />,
  "access dashboard": <LayoutGrid />,
  "role": <ShieldCheck />,
  "module": <Layers />,
  "role permission": <FiUsers />,
  "permission": <FiFile />,
  "permission action": <Activity />,
  "script templates": <Activity />,
  "script dashboard": <LayoutGrid />,
 "script wise dashboard": <FiHome />,
  "parsed result": <File />,
    "execution result": <Replace />,
     "script approval": <MdApproval />,
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);


  const { moduleName, moduleData } = location.state || {};

 const { routes } = usePermissions();
 console.log("routes",routes);


 const normalizeModuleName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "")   
    .replace(/-/g, "");   


  //  const pathSegments = location.pathname.split("/").filter(Boolean);
  // const sidebarKey = pathSegments[0] || "";

const moduleKeyFromUrl = location.pathname
  .split("/")
  .filter(Boolean)[0]     
  ?.toLowerCase();


const resolvedModuleData = useMemo(() => {
  if (!routes?.modules || !moduleKeyFromUrl) return null;

  for (const [moduleName, categories] of Object.entries(routes.modules)) {
    const normalizedModuleName = normalizeModuleName(moduleName);

    if (normalizedModuleName === moduleKeyFromUrl) {
      return categories; // ✅ MATCH FOUND
    }
  }

  return null;
}, [routes, moduleKeyFromUrl]);



const navSections: NavSection[] = useMemo(() => {
  if (!resolvedModuleData) return [];

  return Object.entries(resolvedModuleData)
    .map(([category, permissions]: any) => ({
      title: category,
      collapsible: true,
      items: permissions
        .filter((p: any) => p.navigationUrl && p.selected)
        .map((p: any) => {
          const iconKey = p.permissionsName?.toLowerCase();
          return {
            label: p.permissionsName,
            path: p.navigationUrl,
            icon: iconMap[iconKey] || DefaultIcon,
          };
        }),
    }))
    .filter(section => section.items.length > 0);
}, [resolvedModuleData]);



  // Search filter
  const filteredSections = useMemo(() => {
    if (!searchQuery) return navSections;
    return navSections
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter(section => section.items.length > 0);
  }, [searchQuery, navSections]);

  // Active route detection
  useEffect(() => {
    const currentPath = location.pathname.toLowerCase();
    let activeLabel: string | null = null;

    navSections.forEach(section => {
      section.items.forEach(item => {
        if (item.path.toLowerCase() === currentPath) activeLabel = item.label;
        item.subLinks?.forEach(sub => {
          if (sub.path.toLowerCase() === currentPath) activeLabel = sub.label;
        });
      });
    });

    setSelectedItem(activeLabel);
  }, [location.pathname, navSections]);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handlers
  const handleItemClick = (label: string, path: string) => {
    setSelectedItem(label);
    navigate(path, { state: { moduleName, moduleData } });
    if (isMobile) setIsOpen(false);
  };

  const toggleSection = (title: string) => {
    const updated = new Set(collapsedSections);
    updated.has(title) ? updated.delete(title) : updated.add(title);
    setCollapsedSections(updated);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? (isMobile ? "280px" : "260px") : isMobile ? "0px" : "80px",
      }}
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border/40 shadow transition-all duration-300 ease-in-out ${
        !isMobile ? "relative" : isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* --- HEADER & SEARCH --- */}
      <div className="shrink-0 pt-1 px-4 space-y-4 border-b border-border/40 pb-3">
        <div className="relative group px-1">
          <FiSearch className={`absolute z-10 top-1/2 -translate-y-1/2 text-muted-foreground transition-all ${isOpen ? "left-4 w-4 h-4" : "left-5 w-5 h-5"}`} />
          {isOpen ? (
            <div className="relative">
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-10 bg-accent/30 border-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl text-sm"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div onClick={() => setIsOpen(true)} className="h-10 w-full cursor-pointer rounded-xl hover:bg-accent/50 flex items-center justify-center transition-colors" />
          )}
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="p-3 space-y-1">
            {filteredSections.map(section => {
              const isSectionCollapsed = collapsedSections.has(section.title);
              const isCollapsible = section.collapsible;

              return (
                <div key={section.title} className="space-y-1">
                  {/* Section Header */}
                  {isOpen && (
                    <div
                      onClick={() => isCollapsible && toggleSection(section.title)}
                      className={`flex items-center justify-between px-3 py-2 ${isCollapsible ? 'cursor-pointer hover:bg-accent/40 rounded-lg transition-colors' : ''}`}
                    >
                      <h4 className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                        {section.title}
                      </h4>
                      {isCollapsible && (
                        <motion.div
                          animate={{ rotate: isSectionCollapsed ? 0 : 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Section Items */}
                  <AnimatePresence initial={false}>
                    {(!isSectionCollapsed || !isOpen) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="space-y-0.5 overflow-hidden"
                      >
                        {section.items.map(item => {
                          const isDropdownOpen = openDropdown === item.label;
                          const isActive =
                            selectedItem === item.label ||
                            item.subLinks?.some(sub => sub.label === selectedItem);

                          return (
                            <div key={item.label} className="relative px-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    onClick={() =>
                                      item.subLinks
                                        ? (isOpen
                                            ? setOpenDropdown(isDropdownOpen ? null : item.label)
                                            : setIsOpen(true))
                                        : handleItemClick(item.label, item.path)
                                    }
                                    className={`group relative flex items-center h-10 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                      isActive
                                        ? "bg-primary/15 text-primary shadow-sm border-l-2 border-primary"
                                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:border-l-2 hover:border-accent-foreground/20"
                                    }`}
                                  >
                                    <div className={`flex items-center justify-center shrink-0 ${isOpen ? "mr-3" : "mx-auto"}`}>
                                      <span className={`text-[17px] ${isActive ? "text-primary" : ""}`}>{item.icon}</span>
                                    </div>
                                    {isOpen && (
                                      <span className="flex-1 text-[13px] font-medium truncate">
                                        {item.label}
                                      </span>
                                    )}
                                    {isOpen && item.subLinks && (
                                      <motion.div
                                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <FiChevronDown className="w-4 h-4" />
                                      </motion.div>
                                    )}
                                  </div>
                                </TooltipTrigger>

                                {!isOpen && (
                                  <TooltipContent side="right" sideOffset={15} className="p-0 border-none bg-transparent shadow-none">
                                    <div className="bg-popover border border-border/50 rounded-xl overflow-hidden min-w-50 shadow-2xl">
                                      <div className="px-4 py-3 bg-accent/50 border-b border-border/50">
                                        <p className="font-bold text-[13px] text-foreground flex items-center gap-2">
                                          <span className="text-primary">{item.icon}</span>
                                          {item.label}
                                        </p>
                                      </div>
                                      {item.subLinks && (
                                        <div className="p-1.5 bg-popover">
                                          {item.subLinks.map(sub => (
                                            <div
                                              key={sub.label}
                                              onClick={() => handleItemClick(sub.label, sub.path)}
                                              className={`px-3 py-2 text-[12.5px] rounded-lg transition-colors cursor-pointer mb-0.5 ${
                                                selectedItem === sub.label
                                                  ? "bg-primary/10 text-primary font-semibold"
                                                  : "hover:bg-accent hover:text-foreground text-muted-foreground"
                                              }`}
                                            >
                                              {sub.label}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                )}
                              </Tooltip>

                              {/* Expanded sublinks */}
                              <AnimatePresence>
                                {isOpen && item.subLinks && isDropdownOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden ml-8 mt-1 pl-3 border-l-2 border-border/50 space-y-0.5"
                                  >
                                    {item.subLinks.map(sub => (
                                      <div
                                        key={sub.label}
                                        onClick={() => handleItemClick(sub.label, sub.path)}
                                        className={`py-2 px-3 text-[12.5px] cursor-pointer rounded-md transition-all ${
                                          selectedItem === sub.label
                                            ? "text-primary font-semibold bg-primary/10 border-l-2 border-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                                        }`}
                                      >
                                        {sub.label}
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-4 shrink-0 border-t border-border/40 bg-background">
        <div className={`flex items-center ${isOpen ? "gap-3 px-2" : "justify-center"} py-2.5 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-colors`}>
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <FiUser className="w-4 h-4" />
          </div>
          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
              <p className="text-[13px] font-bold truncate leading-none mb-1">Divakar Barhate</p>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Administrator</p>
            </motion.div>
          )}
          {isOpen && (
            <button className="p-2 hover:bg-background/80 rounded-xl text-muted-foreground hover:text-destructive transition-colors">
              <FiLogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

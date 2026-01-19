

import {
  LayoutGrid,
  School,
  ShieldCheck,
  Users,
  Activity,
  Layers,
  Apple,
  Bot,
} from "lucide-react";
import { BiWindow } from "react-icons/bi";
import { MdSupportAgent } from "react-icons/md";

export type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  subLinks?: { label: string; path: string }[];
};

export type NavSection = {
  title: string;
  items: NavItem[];
  collapsible?: boolean; // NEW: Add this for collapsible sections
};

export type SidebarGroupedData = {
  [key: string]: NavSection[];
};

const sidebarData: SidebarGroupedData = {
  agentManagement: [
    {
      title: "Dashboard",
      items: [
        {
          label: "Dashboard",
          path: "/agentManagement/dashboard",
          icon: <LayoutGrid />,
        },
      ],
    },
    {
      title: "Management",
      collapsible: true, 
      items: [
        {
          label: "Category",
          path: "/agentManagement/category",
          icon: <School />,
        },
        {
          label: "Actions",
          path: "/agentManagement/action",
          icon: <Activity />,
        },
        {
          label: "Agent Update",
          path: "/agentManagement/agentUpdate",
          icon: <MdSupportAgent />,
        },
        {
          label: "Commands",
          path: "/agentManagement/command",
          icon: <Users />,
         
        },
        {
          label: "Standalone Application",
          path: "/agentManagement/standaloneApplication",
          icon: <Layers />,
        },
      ],
    },
    {
      title: "System Assets",
      collapsible: true,
      items: [
        {
          label: "Installed Systems",
          path: "/agentManagement/installedSystemScreen",
          icon: <BiWindow />,
         
        },
        {
          label: "Unregistered Assets",
          path: "/agentManagement/unregisteredAssets",
          icon: <Apple />,
        },
      ],
    },
    {
      title: "Automation",
      collapsible: true,
      items: [
        {
          label: "Script Management",
          path: "/agentManagement/scriptRunner",
          icon: <Bot />,
         
        },
      ],
    },
  
  ],

  accessManagement: [
    {
      title: "Dashboard",
      items: [
        {
          label: "Dashboard",
          path: "/accessManagement/dashboard",
          icon: <LayoutGrid />,
        },
      ],
    },
   
    {
      title: "Settings",
      collapsible: true, 
      items: [
        {
          label: "Access Control",
          path: "#",
          icon: <ShieldCheck />,
          subLinks: [
            { label: "Role", path: "/accessManagement/role" },
             { label: "Module", path: "/accessManagement/module" },
            { label: "Role Permission", path: "/accessManagement/role-permission" },
            { label: "Permission", path: "/accessManagement/permission" },
            { label: "Permission Actions", path: "/accessManagement/permission-action" },
          ],
        },
      ],
    },
  ],
};

export default sidebarData;


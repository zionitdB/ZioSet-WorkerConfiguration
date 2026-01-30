export const CategoryJson = {
  Dashboard: [
    {
      permissionsName: "Agent Dashboard",
      navigationUrl: "/agentConfiguration/dashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
      {
      permissionsName: "Access Dashboard",
      navigationUrl: "/accessControl/dashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
        {
      permissionsName: "Script Dashboard",
      navigationUrl: "/scriptRunner/scriptDashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
       {
      permissionsName: "Script Wise Dashboard",
      navigationUrl: "/scriptRunner/scriptWiseDashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
    
  ], 

    Master: [
       {
      permissionsName: "Category",
      navigationUrl: "/agentConfiguration/category",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
    {
      permissionsName: "Actions",
      navigationUrl: "/agentConfiguration/action",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },

     {
      permissionsName: "Command",
      navigationUrl: "/agentConfiguration/command",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
     {
      permissionsName: "Standalone Application",
      navigationUrl: "/agentConfiguration/standaloneApplication",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
     {
      permissionsName: "User Management",
      navigationUrl: "/accessControl/user-management",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
   
 
  ],

  SystemAsset: [
      {
      permissionsName: "Agent Update",
      navigationUrl: "/agentInstallation/agentUpdate",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
      
    {
      permissionsName: "Installed Systems",
      navigationUrl: "/agentInstallation/installedSystemScreen",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
  {
      permissionsName: "Unregistered Assets",
      navigationUrl: "/agentInstallation/unregisteredAssets",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },

      
 
  ],






 

  

   Automation: [
  
     {
      permissionsName: "Script Management",
      navigationUrl: "/scriptRunner/scriptRunner",
      actions: ["View",  "Export"],
    },
      {
      permissionsName: "Script Templates",
      navigationUrl: "/scriptRunner/scriptTemplate",
      actions: ["View",  "Export"],
    },

  ],

   

  Report: [
  
     {
      permissionsName: "Execution Result",
      navigationUrl: "/scriptRunner/executionResult",
      actions: ["View",  "Export"],
    },
       {
      permissionsName: "Parsed Result",
      navigationUrl: "/scriptRunner/parsedReport",
      actions: ["View",  "Export"],
    },

    
  ],

  Settings: [
    {
      permissionsName: "Role",
      navigationUrl: "/accessControl/role",
      actions: ["View", "Preview", "Edit", "Delete", "Add"],
    },
      {
      permissionsName: "Module",
      navigationUrl: "/accessControl/module",
      actions: ["View", "Edit"],
    },
    {
      permissionsName: "Role Permission",
      navigationUrl: "/accessControl/role-permission",
      actions: ["View", "Edit"],
    },
    {
      permissionsName: "Permission",
      navigationUrl: "/accessControl/permission",
      actions: ["View", "Add"],
    },
    {
      permissionsName: "Permission Action",
      navigationUrl: "/accessControl/permission-action",
      actions: ["View", "Add"],
    },

 {
      permissionsName: "Script Approval",
      navigationUrl: "/scriptRunner/scriptApproval",
      actions: ["View",  "Export"],
    },
    

  ],
};

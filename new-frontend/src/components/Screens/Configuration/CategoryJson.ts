export const CategoryJson = {
  Dashboard: [
    {
      permissionsName: "Agent Dashboard",
      navigationUrl: "/app/agentConfiguration/dashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
      {
      permissionsName: "Access Dashboard",
      navigationUrl: "/app/accessControl/dashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
        {
      permissionsName: "Script Dashboard",
      navigationUrl: "/app/scriptRunner/scriptDashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
       {
      permissionsName: "Script Wise Dashboard",
      navigationUrl: "/app/scriptRunner/scriptWiseDashboard",
      actions: ["View", "Add", "Edit", "Delete"],
    },
    
  ], 

    Master: [
       {
      permissionsName: "Category",
      navigationUrl: "/app/agentConfiguration/category",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
    {
      permissionsName: "Actions",
      navigationUrl: "/app/agentConfiguration/action",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },

     {
      permissionsName: "Command",
      navigationUrl: "/app/agentConfiguration/command",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
     {
      permissionsName: "Standalone Application",
      navigationUrl: "/app/agentConfiguration/standaloneApplication",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
     {
      permissionsName: "User Management",
      navigationUrl: "/app/accessControl/user-management",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
   
 
  ],

  SystemAsset: [
      {
      permissionsName: "Agent Update",
      navigationUrl: "/app/agentInstallation/agentUpdate",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
      
    {
      permissionsName: "Installed Systems",
      navigationUrl: "/app/agentInstallation/installedSystemScreen",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },
  {
      permissionsName: "Unregistered Assets",
      navigationUrl: "/app/agentInstallation/unregisteredAssets",
      actions: ["View", "Add", "Edit", "Delete", "Upload", "Export"],
    },

      
 
  ],






 

  

   Automation: [
  
     {
      permissionsName: "Script Management",
      navigationUrl: "/app/scriptRunner/app/scriptRunner",
      actions: ["View",  "Export"],
    },
      {
      permissionsName: "Script Templates",
      navigationUrl: "/app/scriptRunner/scriptTemplate",
      actions: ["View",  "Export"],
    },

  ],

   

  Report: [
  
     {
      permissionsName: "Execution Result",
      navigationUrl: "/app/scriptRunner/executionResult",
      actions: ["View",  "Export"],
    },
       {
      permissionsName: "Parsed Result",
      navigationUrl: "/app/scriptRunner/parsedReport",
      actions: ["View",  "Export"],
    },
   {
      permissionsName: "LocationWise Execution",
      navigationUrl: "/app/scriptRunner/locationWiseExecutionReport",
      actions: ["View",  "Export"],
    },
    
  ],

  Settings: [
    {
      permissionsName: "Role",
      navigationUrl: "/app/accessControl/role",
      actions: ["View", "Preview", "Edit", "Delete", "Add"],
    },
      {
      permissionsName: "Module",
      navigationUrl: "/app/accessControl/module",
      actions: ["View", "Edit"],
    },
    {
      permissionsName: "Role Permission",
      navigationUrl: "/app/accessControl/role-permission",
      actions: ["View", "Edit"],
    },
    {
      permissionsName: "Permission",
      navigationUrl: "/app/accessControl/permission",
      actions: ["View", "Add"],
    },
    {
      permissionsName: "Permission Action",
      navigationUrl: "/app/accessControl/permission-action",
      actions: ["View", "Add"],
    },

 {
      permissionsName: "Script Approval",
      navigationUrl: "/app/scriptRunner/scriptApproval",
      actions: ["View",  "Export"],
    },
    

  ],
};

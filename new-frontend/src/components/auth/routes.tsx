
import { createBrowserRouter, Navigate } from "react-router-dom";
import HelmetedRoute from "./HelmetedRoute";
import LoginPage from "../SNM/login/loginPage";
import RootRoute from "./root";
import ProtectedRoute from "./ProtectedRoute";
import { JSX } from "react";
import NotFound from "./notFound";
import ForgotPassword from "../SNM/ForgetPassword";
import RoleRoute from "../Screens/Configuration/role";
import RolePermission from "../Screens/Configuration/rolepermission";
import PermissionRoute from "../Screens/Configuration/permission";
import PermissionActionRoute from "../Screens/Configuration/permission-action";
import UserRoute from "../Screens/UserManagement";
import CategoryRoute from "../Screens/CategoryManagement";
import ZiosetAgentDashboard from "../Screens/SuperAdminDashboard";
import AgentConfigDashboard from "../Screens/Dashboard";
import { TreeViewPage } from "../Screens/CategoryManagement/TreeViewPage";
import ActionRoute from "../Screens/ActionsScreen";
import UnregisteredAssetsRoute from "../Screens/UnregistredAssets";
import AgentUpdateRoute from "../Screens/AgentUpdate";
import AgentUpdatesTargetSystemsRoute from "../Screens/AgentUpdate/AgentTargetSystemScreen";
import AgentUpdateForm from "../Screens/AgentUpdate/form";
import ScriptTargetSystemsRoute from "../Screens/ScriptManagementScreens/ScriptList/TargetSystemScreen";
import CommandScreen from "../Screens/CommandScreens";
import InstalledSystemScreen from "../Screens/InstalledSystemScreens";
import ScriptManagementScreen from "../Screens/ScriptManagementScreens";
import AccessControlDashboard from "../Screens/Configuration/dashboard";
import ModuleRoute from "../Screens/Configuration/module";
import ExecutionResultRoute from "../Screens/ScriptManagementScreens/ExucutionResult";
import StandaloneAppRoute from "../Screens/StandaloneApplications";

// Define the type for authenticated route objects
interface AuthenticatedRoute {
  path: string;
  element: JSX.Element;
}

// Define the list of authenticated routes with types
const authenticatedRoutes: AuthenticatedRoute[] = [
  {
    path: "/agentConfiguration/dashboard",
    element: (
      <HelmetedRoute title="dashboard" element={<AgentConfigDashboard />} />
    ),
  },

   {
    path: "/dashboard",
    element: (
      <HelmetedRoute title="dashboard" element={<ZiosetAgentDashboard />} />
    ),
  },

 
  
  
   {
    path: "/accessControl/dashboard",
    element: (
      <HelmetedRoute title="dashboard" element={<AccessControlDashboard />} />
    ),
  },
   {
    path: "/accessControl/user-management",
    element: (
      <HelmetedRoute title="user" element={<UserRoute />} />
    ),
  },

    {
    path: "/accessControl/role",
    element: (
      <HelmetedRoute title="role" element={<RoleRoute />} />
    ),
  },
     {
    path: "/accessControl/module",
    element: (
      <HelmetedRoute title="role" element={<ModuleRoute />} />
    ),
  },
  
  

    {
    path: "/accessControl/role-permission",
    element: (
      <HelmetedRoute title="role-permission" element={<RolePermission />} />
    ),
  },
   {
    path: "/accessControl/permission",
    element: (
      <HelmetedRoute title="permission" element={<PermissionRoute />} />
    ),
  },
    {
    path: "/accessControl/permission-action",
    element: (
      <HelmetedRoute title="action" element={<PermissionActionRoute />} />
    ),
  },
  
    {
    path: "/agentConfiguration/category",
    element: (
      <HelmetedRoute title="category" element={<CategoryRoute />} />
    ),
  },
  
    {
    path: "/agentConfiguration/CategoriesTreeview",
    element: (
      <HelmetedRoute title="CategoriesTreeview" element={<TreeViewPage />} />
    ),
  },

   {
    path: "/agentConfiguration/command",
    element: (
      <HelmetedRoute title="command" element={<CommandScreen />} />
    ),
  },
  {
    path: "/agentConfiguration/action",
    element: (
      <HelmetedRoute title="Action" element={<ActionRoute />} />
    ),
  },

    {
    path: "/agentConfiguration/standaloneApplication",
    element: (
      <HelmetedRoute title="StandaloneApp" element={<StandaloneAppRoute />} />
    ),
  },
     {
    path: "/agentInstallation/installedSystemScreen",
    element: (
      <HelmetedRoute title="installedSystemScreen" element={<InstalledSystemScreen />} />
    ),
  },
  
   {
    path: "/agentInstallation/unregisteredAssets",
    element: (
      <HelmetedRoute title="unregisteredAssets" element={<UnregisteredAssetsRoute />} />
    ),
  },
  {
    path: "/scriptRunner/scriptRunner",
    element: (
      <HelmetedRoute title="ScriptRunner" element={<ScriptManagementScreen />} />
    ),
  },
  {
    path: "/scriptRunner/executionResult",
    element: (
      <HelmetedRoute title="executionResult" element={<ExecutionResultRoute />} />
    ),
  },
 
   {
    path: "/agentInstallation/agentUpdate",
    element: (
      <HelmetedRoute title="AgentUpdate" element={<AgentUpdateRoute />} />
    ),
  },
   {
    path: "/agentInstallation/agentUpdateForm",
    element: (
      <HelmetedRoute title="AgentUpdate" element={<AgentUpdateForm />} />
    ),
  },
  
  {
    path: "/agentInstallation/targetSystems",
    element: (
      <HelmetedRoute title="targetSystems" element={<AgentUpdatesTargetSystemsRoute />} />
    ),
  },
    {
    path: "/scriptRunner/scriptTargetSystems",
    element: (
      <HelmetedRoute title="targetSystems" element={<ScriptTargetSystemsRoute />} />
    ),
  },
  
];

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
        <HelmetedRoute title="LoginPage" element={<LoginPage />} />
    ),
  },
    {
    path: "/forgot-password",
    element: (
        <HelmetedRoute title="forgot-password" element={<ForgotPassword />} />
    ),
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />, 
  },
  {
    element: <RootRoute />, 
    children: [
      {
        element: <ProtectedRoute />, 
        children: authenticatedRoutes, 
      },
    ],
  },
  {
    path: "*", 
    element: <NotFound />, 
  },
]);

export default router;

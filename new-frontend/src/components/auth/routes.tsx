
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
import ScriptTemplateList from "../Screens/ScriptManagementScreens/ScriptTemplet";
import ScriptTemplateForm from "../Screens/ScriptManagementScreens/ScriptTemplet/scriptTempletForm";
import ScriptTemplateRun from "../Screens/ScriptManagementScreens/ScriptTemplet/runTemplateForm";
import ScriptDashboard from "../Screens/ScriptManagementScreens/ScriptDashboard/TotalDashboard";
import ScriptWiseDashboard from "../Screens/ScriptManagementScreens/ScriptDashboard/ScriptWiseDashboard";
import TotalEndPointsRoute from "../Screens/ScriptManagementScreens/ScriptDashboard/CardScreen/TotalEndPoints";
import ActiveEndPointsRoute from "../Screens/ScriptManagementScreens/ScriptDashboard/CardScreen/ActiveEndPoints";
import InActiveEndPointsRoute from "../Screens/ScriptManagementScreens/ScriptDashboard/CardScreen/InActiveEndPoints.tsx";
import ScriptCardList from "../Screens/ScriptManagementScreens/ScriptDashboard/CardScreen/ScriptViewScreen.tsx";
import ScriptExecutionReport from "../Screens/ScriptManagementScreens/ScriptDashboard/CardScreen/ScriptExecutionReport.tsx";
import ParsedReport from "../Screens/ScriptManagementScreens/ParsedReport/index.tsx";
import ParsedExecutionDetails from "../Screens/ScriptManagementScreens/ParsedReport/ExecutionReportByScript.tsx";
import ScriptApprovalScreen from "../Screens/ScriptManagementScreens/ScriptApproval/index.tsx";
import ScriptExecutionReportAll from "../Screens/ScriptManagementScreens/ScriptDashboard/CardScreen/ScriptExecutionReportAll.tsx";
import ScriptExecutionDrillReport from "../Screens/ScriptManagementScreens/ScriptExecutionDrillReport/index.tsx";
import PremiumAgentDashboard from "../Screens/Dashboard/index.tsx";

// Define the type for authenticated route objects
interface AuthenticatedRoute {
  path: string;
  element: JSX.Element;
}

// Define the list of authenticated routes with types
const authenticatedRoutes: AuthenticatedRoute[] = [
  {
    path: "/app/agentConfiguration/dashboard",
    element: (
      <HelmetedRoute title="dashboard" element={<PremiumAgentDashboard />} />
    ),
  },

   {
    path: "/app/dashboard",
    element: (
      <HelmetedRoute title="dashboard" element={<ZiosetAgentDashboard />} />
    ),
  },

 
  
  
   {
    path: "/app/accessControl/dashboard",
    element: (
      <HelmetedRoute title="dashboard" element={<AccessControlDashboard />} />
    ),
  },
   {
    path: "/app/accessControl/user-management",
    element: (
      <HelmetedRoute title="user" element={<UserRoute />} />
    ),
  },

    {
    path: "/app/accessControl/role",
    element: (
      <HelmetedRoute title="role" element={<RoleRoute />} />
    ),
  },
     {
    path: "/app/accessControl/module",
    element: (
      <HelmetedRoute title="role" element={<ModuleRoute />} />
    ),
  },
  
  

    {
    path: "/app/accessControl/role-permission",
    element: (
      <HelmetedRoute title="role-permission" element={<RolePermission />} />
    ),
  },
   {
    path: "/app/accessControl/permission",
    element: (
      <HelmetedRoute title="permission" element={<PermissionRoute />} />
    ),
  },
    {
    path: "/app/accessControl/permission-action",
    element: (
      <HelmetedRoute title="action" element={<PermissionActionRoute />} />
    ),
  },
  
    {
    path: "/app/agentConfiguration/category",
    element: (
      <HelmetedRoute title="category" element={<CategoryRoute />} />
    ),
  },
  
    {
    path: "/app/agentConfiguration/CategoriesTreeview",
    element: (
      <HelmetedRoute title="CategoriesTreeview" element={<TreeViewPage />} />
    ),
  },

   {
    path: "/app/agentConfiguration/command",
    element: (
      <HelmetedRoute title="command" element={<CommandScreen />} />
    ),
  },
  {
    path: "/app/agentConfiguration/action",
    element: (
      <HelmetedRoute title="Action" element={<ActionRoute />} />
    ),
  },

    {
    path: "/app/agentConfiguration/standaloneApplication",
    element: (
      <HelmetedRoute title="StandaloneApp" element={<StandaloneAppRoute />} />
    ),
  },
     {
    path: "/app/agentInstallation/installedSystemScreen",
    element: (
      <HelmetedRoute title="installedSystemScreen" element={<InstalledSystemScreen />} />
    ),
  },
  
   {
    path: "/app/agentInstallation/unregisteredAssets",
    element: (
      <HelmetedRoute title="unregisteredAssets" element={<UnregisteredAssetsRoute />} />
    ),
  },
    {
    path: "/app/scriptRunner/scriptDashboard",
    element: (
      <HelmetedRoute title="Dashboard" element={<ScriptDashboard />} />
    ),
  },
      {
    path: "/app/scriptRunner/scriptWiseDashboard",
    element: (
      <HelmetedRoute title="Dashboard" element={<ScriptWiseDashboard />} />
    ),
  },
  
  {
    path: "/app/scriptRunner/scriptRunner",
    element: (
      <HelmetedRoute title="ScriptRunner" element={<ScriptManagementScreen />} />
    ),
  },
 {
    path: "/app/scriptRunner/scriptTemplate",
    element: (
      <HelmetedRoute title="scriptTemplate" element={<ScriptTemplateList />} />
    ),
  },
   {
    path: "/app/scriptRunner/scriptTemplateForm",
    element: (
      <HelmetedRoute title="scriptTemplate" element={<ScriptTemplateForm />} />
    ),
  },
 {
    path: "/app/scriptRunner/scriptTemplateRun",
    element: (
      <HelmetedRoute title="scriptTemplate" element={<ScriptTemplateRun />} />
    ),
  },
  
  {
    path: "/app/scriptRunner/executionResult",
    element: (
      <HelmetedRoute title="executionResult" element={<ExecutionResultRoute />} />
    ),
  },
 
   {
    path: "/app/agentInstallation/agentUpdate",
    element: (
      <HelmetedRoute title="AgentUpdate" element={<AgentUpdateRoute />} />
    ),
  },
   {
    path: "/app/agentInstallation/agentUpdateForm",
    element: (
      <HelmetedRoute title="AgentUpdate" element={<AgentUpdateForm />} />
    ),
  },
  
  {
    path: "/app/agentInstallation/targetSystems",
    element: (
      <HelmetedRoute title="targetSystems" element={<AgentUpdatesTargetSystemsRoute />} />
    ),
  },
    {
    path: "/app/scriptRunner/scriptTargetSystems",
    element: (
      <HelmetedRoute title="targetSystems" element={<ScriptTargetSystemsRoute />} />
    ),
  },
     {
    path: "/app/scriptRunner/totalEndPoints",
    element: (
      <HelmetedRoute title="totalEndPoints" element={<TotalEndPointsRoute />} />
    ),
  },
     {
    path: "/app/scriptRunner/activeEndPoints",
    element: (
      <HelmetedRoute title="ActiveEndPoints" element={<ActiveEndPointsRoute />} />
    ),
  },
     {
    path: "/app/scriptRunner/inActiveEndPoints",
    element: (
      <HelmetedRoute title="InActiveEndPoints" element={<InActiveEndPointsRoute />} />
    ),
  },
  {
    path: "/app/scriptRunner/scriptCardList",
    element: (
      <HelmetedRoute title="ScriptCardList" element={<ScriptCardList />} />
    ),
  },
  {
    path: "/app/scriptRunner/executionReport",
    element: (
      <HelmetedRoute title="executionReport" element={<ScriptExecutionReport />} />
    ),
  },
    {
    path: "/app/scriptRunner/executionReportAll",
    element: (
      <HelmetedRoute title="executionReport" element={<ScriptExecutionReportAll />} />
    ),
  },

  {
    path: "/app/scriptRunner/locationWiseExecutionReport",
    element: (
      <HelmetedRoute title="executionReport" element={<ScriptExecutionDrillReport />} />
    ),
  },
  
  
    {
    path: "/app/scriptRunner/parsedReport",
    element: (
      <HelmetedRoute title="parsedReport" element={<ParsedReport />} />
    ),
  },
    {
    path: "/app/scriptRunner/parsedExecution",
    element: (
      <HelmetedRoute title="parsedExecution" element={<ParsedExecutionDetails />} />
    ),
  },
     {
    path: "/app/scriptRunner/scriptApproval",
    element: (
      <HelmetedRoute title="scriptApproval" element={<ScriptApprovalScreen />} />
    ),
  },
  
];

const router = createBrowserRouter([
  {
    path: "/app/login",
    element: (
        <HelmetedRoute title="LoginPage" element={<LoginPage />} />
    ),
  },
    {
    path: "/app/forgot-password",
    element: (
        <HelmetedRoute title="forgot-password" element={<ForgotPassword />} />
    ),
  },
  {
    path: "/",
    element: <Navigate to="/app/login" replace />, 
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

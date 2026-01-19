// import { useState, useEffect } from "react";
// import RolePermissionCard from "./rolePermissionCard";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";


// import {
//   ShieldCheck,
//   FolderCog,
//   BadgeCheck,
//   Wrench,
//   Settings,
//   Lock,
//   Puzzle,
//   Activity,
//   Globe,
//   Users,
// } from "lucide-react";

// import {
//   useGetPermissionsAndActionsByRole,
//   useGetRole,
//   useUpdateRolePermissions,
//   useUpdateRolePermissionsAction,
// } from "./hook";

// const icons = [
//   ShieldCheck,
//   FolderCog,
//   BadgeCheck,
//   Wrench,
//   Settings,
//   Lock,
//   Puzzle,
//   Activity,
//   Globe,
//   Users,
// ];

// function getRandomIcon(index: number) {
//   const Icon = icons[index % icons.length];
//   return <Icon className="w-5 h-5 text-primary" />;
// }

// const RolePermission = () => {
//   const [selectedRole, setSelectedRole] = useState("");
//   const [permissionsData, setPermissionsData] = useState<any[]>([]);


//   //   const { data: userCount } = useGetUserCount();
//   // const { data: allData = [] } = useGetPermissionsActions()
//   // const { data: allPermissions = [] } = useGetPermissions()

//   // const totalPermissions = allPermissions.length||0
//   // const totalActions = allData.length||0

    
//   const { data: rowData } = useGetRole();
//   const roleData = rowData || [];

//   const { data: perData } = useGetPermissionsAndActionsByRole(selectedRole);
//   const { mutate: updateRolePermission } = useUpdateRolePermissions();
//   const { mutate: updateRolePermissionAction } = useUpdateRolePermissionsAction();

//   // --- HANDLERS -----------------------------------------------------------------------
//   const handlePermissionToggle = (categoryIndex: number, permissionsId: number, isChecked: boolean) => {
//     const updatedData = [...permissionsData];
//     const permission = updatedData[categoryIndex].permissions.find(
//       (perm: any) => perm.permissionsId === permissionsId
//     );

//     if (permission) permission.selected = isChecked;
//     setPermissionsData(updatedData);

//     updateRolePermission({
//       roleId: selectedRole,
//       permissionId: permissionsId,
//       selected: isChecked,
//     });
//   };

//   const handleActionToggle = (
//     categoryIndex: number,
//     permissionsId: number,
//     actionIndex: number,
//     isChecked: boolean
//   ) => {
//     const updatedData = [...permissionsData];
//     const permission = updatedData[categoryIndex].permissions.find(
//       (perm: any) => perm.permissionsId === permissionsId
//     );

//     if (permission) {
//       const action = permission.actions[actionIndex];
//       if (action) action.selected = isChecked;
//     }

//     setPermissionsData(updatedData);

//     updateRolePermissionAction({
//       roleId: selectedRole,
//       permissionId: permissionsId,
//       actionName: updatedData[categoryIndex].permissions.find(
//         (perm: any) => perm.permissionsId === permissionsId
//       )?.actions[actionIndex]?.actionName,
//       selected: isChecked,
//     });
//   };

//   // --- GROUP PERMISSIONS ---------------------------------------------------------------
//   useEffect(() => {
//     if (perData) {
//       const groupedPermissions: { [key: string]: any[] } = {};

//       Object.keys(perData).forEach((category) => {
//         if (Array.isArray(perData[category])) {
//           perData[category].forEach((permission: any) => {
//             const {
//               category: permissionCategory,
//               permissionsName,
//               permissionsId,
//               actions,
//               selected,
//             } = permission;

//             if (!groupedPermissions[permissionCategory]) {
//               groupedPermissions[permissionCategory] = [];
//             }

//             groupedPermissions[permissionCategory].push({
//               permissionsId,
//               permissionsName,
//               selected,
//               actions: actions.map((action: any) => ({
//                 actionName: action.actionName,
//                 selected: action.selected,
//               })),
//             });
//           });
//         }
//       });

//       const mappedPermissionsData = Object.keys(groupedPermissions).map(
//         (category) => ({
//           name: category,
//           permissions: groupedPermissions[category],
//         })
//       );

//       setPermissionsData(mappedPermissionsData);
//     }
//   }, [perData]);





//   return (
//     <div className="p-6 bg-background rounded-lg shadow-sm mt-4 space-y-8">

//       <div className="text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-primary">
//           Role Permissions
//         </h1>
//         <p className="text-muted-foreground mt-1">
//           Manage roles, permissions, and action-level access.
//         </p>
//       </div>
// {/* 
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

//   <Link to="/user-management">
//     <Card className="relative overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1">
//       <CardContent className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium uppercase opacity-90">Total Users</p>
//           <p className="text-3xl font-bold">{userCount||0}</p>
//         </div>
//             <Activity className="w-8 h-8 text-primary opacity-80" />
//       </CardContent>
//       <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
//         <Activity className="w-16 h-16" />
//       </div>
//     </Card>
//   </Link>
//   <Link to="/role">
//       <Card className="relative overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1"> <CardContent className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium uppercase opacity-90">Roles</p>
//           <p className="text-3xl font-bold">{roleData.length}</p>
//         </div>
//         <Users className="w-10 h-10 opacity-80" />
//       </CardContent>
//    <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
//         <Users className="w-20 h-20" />
//       </div>
//     </Card>
//   </Link>

//   <Link to="/permission">
//       <Card className="relative overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1"> <CardContent className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium uppercase opacity-90">Permissions</p>
//           <p className="text-3xl font-bold">{totalPermissions}</p>
//         </div>
//         <ShieldCheck className="w-10 h-10 opacity-80" />
//       </CardContent>
//        <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
//         <ShieldCheck className="w-20 h-20" />
//       </div>
//     </Card>
//   </Link>

//   <Link to="/permission-action">
//       <Card className="relative overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1"> <CardContent className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium uppercase opacity-90">Actions</p>
//           <p className="text-3xl font-bold">{totalActions}</p>
//         </div>
//         <Wrench className="w-10 h-10 opacity-80" />
//       </CardContent>
//    <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
//         <Wrench className="w-20 h-20" />
//       </div>
//     </Card>
//   </Link>



// </div> */}

//       <div className="flex justify-center">
//         <div className="flex flex-row items-center gap-4 mb-4">
//           <Label className="text-lg font-medium">Select Role:</Label>

//           <Select onValueChange={setSelectedRole} defaultValue={selectedRole}>
//             <SelectTrigger className="w-65 bg-muted">
//               <SelectValue placeholder="Choose a Role" />
//             </SelectTrigger>

//             <SelectContent>
//               {roleData.map((role: any) => (
//                 <SelectItem key={role.roleId} value={role.roleId}>
//                   {role.roleName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {selectedRole && (
//         <Accordion type="multiple" className="space-y-6">
//           {permissionsData.map((category, categoryIndex) => (
//             <AccordionItem
//               key={category.name}
//               value={`category-${categoryIndex}`}
//               className="rounded-lg border shadow-sm bg-muted/30"
//             >
//               <AccordionTrigger className="px-5 py-4 hover:bg-muted rounded-t-lg">
//                 <div className="flex items-center gap-3">
//                   {getRandomIcon(categoryIndex)}
//                   <span className="text-lg font-semibold">{category.name}</span>
//                 </div>
//               </AccordionTrigger>

//               <AccordionContent className="px-5 pb-5 pt-3 bg-card rounded-b-lg">
//                 <Separator className="my-3" />

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                   {category.permissions.map((permission: any, permissionIndex: number) => (
//                     <RolePermissionCard
//                       key={`${category.name}-${permission.permissionsName}-${permissionIndex}`}
//                       permissionsName={permission.permissionsName}
//                       actions={permission.actions}
//                       selected={permission.selected}
//                       onPermissionChange={(isChecked) =>
//                         handlePermissionToggle(categoryIndex, permission.permissionsId, isChecked)
//                       }
//                       onActionChange={(actionIndex, isChecked) =>
//                         handleActionToggle(categoryIndex, permission.permissionsId, actionIndex, isChecked)
//                       }
//                     />
//                   ))}
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       )}
//     </div>
//   );
// };

// export default RolePermission;



import { useState, useEffect } from "react";
import RolePermissionCard from "./rolePermissionCard";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  FolderCog,
  BadgeCheck,
  Wrench,
  Settings,
  Lock,
  Puzzle,
  Activity,
  Globe,
  Users,
} from "lucide-react";

import {
  useGetPermissionsAndActionsByRole,
  useGetRole,
  useUpdateRolePermissions,
  useUpdateRolePermissionsAction,
} from "./hook";
import Breadcrumb from "@/components/common/breadcrumb";

const icons = [
  ShieldCheck,
  FolderCog,
  BadgeCheck,
  Wrench,
  Settings,
  Lock,
  Puzzle,
  Activity,
  Globe,
  Users,
];

const getIcon = (index: number) => {
  const Icon = icons[index % icons.length];
  return <Icon className="w-5 h-5 text-primary" />;
};

const RolePermission = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [permissionsData, setPermissionsData] = useState<any[]>([]);

  const { data: roleData = [] } = useGetRole();
  const { data: perData } = useGetPermissionsAndActionsByRole(selectedRole);

  const { mutate: updateRolePermission } = useUpdateRolePermissions();
  const { mutate: updateRolePermissionAction } =
    useUpdateRolePermissionsAction();

  /* -------------------------------------------------------------------------- */
  /* HANDLE TOGGLES                                                              */
  /* -------------------------------------------------------------------------- */

  const handlePermissionToggle = (
    categoryIndex: number,
    permissionsId: number,
    isChecked: boolean
  ) => {
    const updated = [...permissionsData];
    const permission = updated[categoryIndex].permissions.find(
      (p: any) => p.permissionsId === permissionsId
    );

    if (permission) permission.selected = isChecked;
    setPermissionsData(updated);

    updateRolePermission({
      roleId: selectedRole,
      permissionId: permissionsId,
      selected: isChecked,
    });
  };

  const handleActionToggle = (
    categoryIndex: number,
    permissionsId: number,
    actionIndex: number,
    isChecked: boolean
  ) => {
    const updated = [...permissionsData];
    const permission = updated[categoryIndex].permissions.find(
      (p: any) => p.permissionsId === permissionsId
    );

    if (permission?.actions[actionIndex]) {
      permission.actions[actionIndex].selected = isChecked;
    }

    setPermissionsData(updated);

    updateRolePermissionAction({
      roleId: selectedRole,
      permissionId: permissionsId,
      actionName: permission?.actions[actionIndex]?.actionName,
      selected: isChecked,
    });
  };

  /* -------------------------------------------------------------------------- */
  /* MAP API RESPONSE (MODULE → CATEGORY → PERMISSIONS)                          */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!perData?.modules) return;

    const mapped: any[] = [];

    Object.entries(perData.modules).forEach(
      ([moduleName, categories]: any) => {
        Object.entries(categories).forEach(
          ([categoryName, permissions]: any) => {
            mapped.push({
              name: `${moduleName} → ${categoryName}`,
              permissions: permissions.map((perm: any) => ({
                permissionsId: perm.permissionsId,
                permissionsName: perm.permissionsName,
                selected: !!perm.selected,
                actions: (perm.actions || []).map((action: any) => ({
                  actionName: action.actionName,
                  selected: action.selected,
                })),
              })),
            });
          }
        );
      }
    );

    setPermissionsData(mapped);
  }, [perData]);

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="p-6 bg-background rounded-lg shadow-sm mt-4 space-y-8">
         <div className="mb-6">
                <Breadcrumb
                  items={[
                    {
                      label: "Module Dashboard",
                      path: "/dashboard",
                    },
                    {
                      label: "Role Permission",
                    },
                  ]}
                />
              </div>

              
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">
          Role Permissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage roles, permissions, and action-level access
        </p>
      </div>

      {/* ROLE SELECT */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4">
          <Label className="text-lg">Select Role:</Label>

          <Select onValueChange={setSelectedRole}>
            <SelectTrigger className="w-64 bg-muted">
              <SelectValue placeholder="Choose Role" />
            </SelectTrigger>

            <SelectContent>
              {roleData.map((role: any) => (
                <SelectItem
                  key={role.roleId}
                  value={String(role.roleId)}
                >
                  {role.roleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PERMISSIONS */}
      {selectedRole && (
        <Accordion type="multiple" className="space-y-6">
          {permissionsData.map((category, categoryIndex) => (
            <AccordionItem
              key={category.name}
              value={category.name}
              className="border rounded-lg shadow-sm bg-muted/30"
            >
              <AccordionTrigger className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {getIcon(categoryIndex)}
                  <span className="font-semibold text-lg">
                    {category.name}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.permissions.map(
                    (permission: any, permissionIndex: number) => (
                      <RolePermissionCard
                        key={`${category.name}-${permissionIndex}`}
                        permissionsName={permission.permissionsName}
                        actions={permission.actions}
                        selected={permission.selected}
                        onPermissionChange={(checked) =>
                          handlePermissionToggle(
                            categoryIndex,
                            permission.permissionsId,
                            checked
                          )
                        }
                        onActionChange={(actionIndex, checked) =>
                          handleActionToggle(
                            categoryIndex,
                            permission.permissionsId,
                            actionIndex,
                            checked
                          )
                        }
                      />
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default RolePermission;

// import React, { useState, useEffect } from "react";
// import { Label } from "@/components/ui/label";
// import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
// import { useGetPermissions } from "./hooks";
// import { CategoryJson } from "../CategoryJson";

// interface CategoryItem {
//   permissionsName: string;
//   navigationUrl: string;
//   actions?: string[];
// }


// interface AddUserDialogProps {
//   formId: string;
//   onSubmit: (formData: any) => void;
//   defaultValues?: any;
// }

// const PermissionActionForm: React.FC<AddUserDialogProps> = ({
//   onSubmit,
//   formId,
//   defaultValues = {},
// }) => {
//   const { data: Alldata } = useGetPermissions(); 
//   const [formData, setFormData] = useState({
//     action: defaultValues.action || "",
//     permission: defaultValues.permission || "",
//   });

//   const [availableActions, setAvailableActions] = useState<string[]>([]); 
//   const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null); 

//   const filterCategoriesWithActions = () => {
//     const filteredCategory: { [key: string]: CategoryItem[] } = {};
//     Object.keys(CategoryJson).forEach((categoryKey) => {
//       const categoryItems = CategoryJson[categoryKey as keyof typeof CategoryJson]; 
      
//       const filteredPermissions = categoryItems.filter(
//         (item) => item.actions && item.actions.length > 0
//       );
//       if (filteredPermissions.length > 0) {
//         filteredCategory[categoryKey] = filteredPermissions;
//       }
//     });
//     return filteredCategory;
//   };

//   const filteredCategories = filterCategoriesWithActions();

//   useEffect(() => {
//     if (defaultValues.permission) {
//       const permission = Object.values(filteredCategories).flat().find(
//         (item) => item.permissionsName === defaultValues.permission
//       );
//       if (permission) {
//         setAvailableActions(permission.actions || []); 
//       }
//     }
//   }, [defaultValues, filteredCategories]);

//   const handlePermissionChange = (permissionName: string) => {
//     setFormData({ ...formData, permission: permissionName });

//     const permission = Object.values(filteredCategories)
//       .flat()
//       .find((item) => item.permissionsName === permissionName);
//     if (permission) {
//       setAvailableActions(permission.actions || []); 
//       const selectedPermission = Alldata.find(
//         (item: any) => item.permissionsName === permissionName
//       );
//       if (selectedPermission) {
//         setSelectedPermissionId(selectedPermission.permissionsId); 
//       }
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const submitData = {
//       actionName: formData.action,
//       permissions: {
//         permissionsId: selectedPermissionId,
//       },
//     };
//     onSubmit(submitData); 
//     setFormData({
//       action: "",
//       permission: "",
//     });
//   };

//   return (
//     <form id={formId} onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           {/* Permission Select (Top) */}
//           <div className="space-y-2">
//             <Label>Select Permission</Label>
//             <Select
//               value={formData.permission}
//               onValueChange={handlePermissionChange} 
//             >
//               <SelectTrigger className="w-full">
//                 <span>{formData.permission || "Select Permission"}</span>
//               </SelectTrigger>
//             <SelectContent className="max-h-64 w-full overflow-auto">
//   {Object.entries(filteredCategories).map(([categoryKey, permissions]) => (
//     <div key={categoryKey}>
//       <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
//         {categoryKey}
//       </div>
//       {permissions.map((item, index) => (
//         <SelectItem key={index} value={item.permissionsName}>
//           {item.permissionsName}
//         </SelectItem>
//       ))}
//     </div>
//   ))}
// </SelectContent>

//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Select Action</Label>
//             <Select
//               value={formData.action}
//               onValueChange={(value) =>
//                 setFormData({ ...formData, action: value })
//               }
//               disabled={!formData.permission}
//             >
//               <SelectTrigger className="w-full">
//                 <span>{formData.action || "Select Action"}</span>
//               </SelectTrigger>
//               <SelectContent className="w-full">
//                 {availableActions.map((action, index) => (
//                   <SelectItem key={index} value={action}>
//                     {action}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PermissionActionForm;












// import React, { useState, useEffect } from "react"; 
// import { Label } from "@/components/ui/label";
// import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
// import { useGetPermissions } from "./hooks";
// import { CategoryJson } from "../CategoryJson";
// import { Button } from "@/components/ui/button";

// interface AddUserDialogProps {
//   formId: string;
//   onSubmit: (formData: any) => void;
//   defaultValues?: any;
// }

// const PermissionActionForm: React.FC<AddUserDialogProps> = ({
//   onSubmit,
//   formId,
//   defaultValues = {},
// }) => {
//   const { data: Alldata } = useGetPermissions(); 

//   const [formData, setFormData] = useState({
//     action: "",
//     permission: "",
//   });

//   const [availableActions, setAvailableActions] = useState<string[]>([]); 
//   const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null); 
//   const [actionTable, setActionTable] = useState<any[]>([]);


//   const filterCategoriesWithActions = () => {
//     const filteredCategory: { [key: string]: any[] } = {};
//     Object.keys(CategoryJson).forEach((categoryKey) => {
//       const categoryItems = CategoryJson[categoryKey as keyof typeof CategoryJson]; 
//       const filteredPermissions = categoryItems.filter(
//         (item) => item.actions && item.actions.length > 0
//       );
//       if (filteredPermissions.length > 0) {
//         filteredCategory[categoryKey] = filteredPermissions;
//       }
//     });
//     return filteredCategory;
//   };

//   const filteredCategories = filterCategoriesWithActions();

//   useEffect(() => {
//     if (defaultValues.permission) {
//       const permission = Object.values(filteredCategories).flat().find(
//         (item) => item.permissionsName === defaultValues.permission
//       );
//       if (permission) {
//         setAvailableActions(permission.actions || []); 
//       }
//     }
//   }, [defaultValues, filteredCategories]);

//   const handlePermissionChange = (permissionName: string) => {
//     setFormData({ ...formData, permission: permissionName, action: "" });

//     const permission = Object.values(filteredCategories)
//       .flat()
//       .find((item) => item.permissionsName === permissionName);

//     if (permission) {
//       setAvailableActions(permission.actions || []); 
//       const selectedPermission = Alldata.find(
//         (item: any) => item.permissionsName === permissionName
//       );
//       if (selectedPermission) {
//         setSelectedPermissionId(selectedPermission.permissionsId); 
//       }
//     }
//   };

//   const handleAddAction = () => {
//     if (!formData.permission || !formData.action || selectedPermissionId === null) return;

//     const exists = actionTable.some(
//       (item) =>
//         item.permissions.permissionsId === selectedPermissionId &&
//         item.actionName === formData.action
//     );
//     if (exists) return;


//     setActionTable([
//       ...actionTable,
//       {
//         permissions: { permissionsId: selectedPermissionId },
//         actionName: formData.action,
//         permissionName: formData.permission, 
//       },
//     ]);

//     setFormData({ ...formData, action: "" });
//   };

//   const handleRemoveAction = (index: number) => {
//     const newTable = [...actionTable];
//     newTable.splice(index, 1);
//     setActionTable(newTable);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (actionTable.length === 0) return;

//     // Only submit needed keys
//     const submitData = actionTable.map(({ permissions, actionName }) => ({
//       permissions,
//       actionName,
//     }));

//     onSubmit(submitData);
//     setActionTable([]);
//     setFormData({ action: "", permission: "" });
//     setSelectedPermissionId(null);
//   };

//   return (
//     <form id={formId} onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           {/* Permission Select */}
//           <div className="space-y-2">
//             <Label>Select Permission</Label>
//             <Select
//               value={formData.permission}
//               onValueChange={handlePermissionChange} 
//             >
//               <SelectTrigger className="w-full">
//                 <span>{formData.permission || "Select Permission"}</span>
//               </SelectTrigger>
//               <SelectContent className="max-h-64 w-full overflow-auto">
//                 {Object.entries(filteredCategories).map(([categoryKey, permissions]) => (
//                   <div key={categoryKey}>
//                     <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
//                       {categoryKey}
//                     </div>
//                     {permissions.map((item, index) => (
//                       <SelectItem key={index} value={item.permissionsName}>
//                         {item.permissionsName}
//                       </SelectItem>
//                     ))}
//                   </div>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Action Select + Add Button */}
//           <div className="space-y-2 flex flex-col">
//             <Label>Select Action</Label>
//             <div className="flex gap-2">
//               <Select
//                 value={formData.action}
//                 onValueChange={(value) => setFormData({ ...formData, action: value })}
//                 disabled={!formData.permission}
//               >
//                 <SelectTrigger className="w-full">
//                   <span>{formData.action || "Select Action"}</span>
//                 </SelectTrigger>
//                 <SelectContent className="w-full">
//                   {availableActions.map((action, index) => (
//                     <SelectItem key={index} value={action}>
//                       {action}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Button type="button" onClick={handleAddAction}>
//                 + Add
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         {actionTable.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 border rounded-md shadow-sm">
//               <thead className="bg-muted">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Permission</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remove</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-background divide-y divide-gray-200">
//                 {actionTable.map((item, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-2">{item.permissionName}</td>
//                     <td className="px-4 py-2">{item.actionName}</td>
//                     <td className="px-4 py-2">
//                       <Button variant="destructive" size="sm" onClick={() => handleRemoveAction(index)}>
//                         Remove
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//       </div>
//     </form>
//   );
// };

// export default PermissionActionForm;








import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { useGetPermissions } from "./hooks";
import { CategoryJson } from "../CategoryJson";
import { Button } from "@/components/ui/button";

interface AddUserDialogProps {
  formId: string;
  onSubmit: (formData: any) => void;
}

interface PermissionItem {
  permissionsId: number;
  permissionsName: string;
  category: keyof typeof CategoryJson;  
}

const PermissionActionForm: React.FC<AddUserDialogProps> = ({
  onSubmit,
  formId,
}) => {

const { data: Alldata = [] } = useGetPermissions() as { data: PermissionItem[] };


  const [formData, setFormData] = useState({
    permissionId: "",
    action: "",
  });

  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [actionTable, setActionTable] = useState<any[]>([]);

const groupedPermissions: Record<string, PermissionItem[]> = Alldata.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});


  const handlePermissionChange = (permissionId: string) => {
    const id = Number(permissionId);
    setFormData({ permissionId: id.toString(), action: "" });

    const selected = Alldata.find((p:any) => p.permissionsId === id);
    if (!selected) return;

    const actionsFromCategory =
      CategoryJson[selected.category]?.find(
        (item: any) => item.permissionsName === selected.permissionsName
      )?.actions || [];

    setAvailableActions(actionsFromCategory);
  };


  const handleAddAction = () => {
    if (!formData.permissionId || !formData.action) return;

    const pid = Number(formData.permissionId);
    const permission = Alldata.find((p:any) => p.permissionsId === pid);
    if (!permission) return;

    const exists = actionTable.some(
      (item) =>
        item.permissions.permissionsId === pid &&
        item.actionName === formData.action
    );

    if (exists) return;

    setActionTable([
      ...actionTable,
      {
        permissions: { permissionsId: pid },
        permissionName: permission.permissionsName,
        actionName: formData.action,
      },
    ]);

    setFormData({ ...formData, action: "" });
  };

  const handleRemoveAction = (index: number) => {
    const updated = [...actionTable];
    updated.splice(index, 1);
    setActionTable(updated);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (actionTable.length === 0) return;

    const finalPayload = actionTable.map((row) => ({
      permissions: row.permissions,
      actionName: row.actionName,
    }));

    onSubmit(finalPayload);

    setFormData({ permissionId: "", action: "" });
    setActionTable([]);
  };


  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

          {/* PERMISSION SELECT */}
          <div className="space-y-2">
            <Label>Select Permission</Label>

            <Select
              value={formData.permissionId}
              onValueChange={handlePermissionChange}
            >
              <SelectTrigger className="w-full">
                {formData.permissionId ? "Permission selected" : "Select Permission"}
              </SelectTrigger>

              <SelectContent className="max-h-64 w-full overflow-auto">
                {Object.entries(groupedPermissions).map(([category, list]) => (
                  <div key={category}>
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                      {category}
                    </div>

                    {list.map((item: any) => (
                      <SelectItem
                        key={item.permissionsId}
                        value={item.permissionsId.toString()}
                      >
                        {item.permissionsName}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ACTION SELECT */}
          <div className="space-y-2 flex flex-col">
            <Label>Select Action</Label>
            <div className="flex gap-2">
              <Select
                value={formData.action}
                onValueChange={(value) => setFormData({ ...formData, action: value })}
                disabled={!formData.permissionId}
              >
                <SelectTrigger className="w-full">
                  {formData.action || "Select Action"}
                </SelectTrigger>

                <SelectContent>
                  {availableActions.map((action, i) => (
                    <SelectItem key={i} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="button" onClick={handleAddAction}>
                + Add
              </Button>
            </div>
          </div>
        </div>

        {/* ACTION TABLE */}
        {actionTable.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-md shadow-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium">Permission</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Action</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Remove</th>
                </tr>
              </thead>

              <tbody className="bg-background divide-y divide-gray-200">
                {actionTable.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{row.permissionName}</td>
                    <td className="px-4 py-2">{row.actionName}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveAction(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </form>
  );
};

export default PermissionActionForm;


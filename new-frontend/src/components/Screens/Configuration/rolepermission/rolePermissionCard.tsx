// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";

// interface RolePermissionCardProps {
//   permissionsName: string;
//   actions: { actionName: string; selected: boolean }[];
//   selected: boolean;
//   onPermissionChange: (isChecked: boolean) => void;
//   onActionChange: (index: number, isChecked: boolean) => void;
// }

// const RolePermissionCard: React.FC<RolePermissionCardProps> = ({
//   permissionsName,
//   actions,
//   selected,
//   onPermissionChange,
//   onActionChange,
// }) => {
//   return (
//     <div className="rounded-lg shadow-md border bg-muted border-gray-300 dark:border-gray-600  transition-colors duration-300">
//       <Accordion type="single" collapsible>
//         <AccordionItem value={permissionsName}>
//           <div className="flex items-center justify-between px-4 py-3  rounded-t-lg">
//             <div className="flex items-center gap-3">
//               <Switch
//                 checked={selected}
//                 onCheckedChange={(isChecked) =>
//                   onPermissionChange(isChecked as boolean)
//                 }
//               />
//           <div
//   className="text-md font-semibold text-gray-800 dark:text-gray-100 max-w-[170px] truncate"
//   title={permissionsName}
// >
//   {permissionsName}
// </div>


//             </div>
//             <AccordionTrigger className="text-sm text-blue-600 hover:underline dark:text-blue-400">
//               View Actions
//             </AccordionTrigger>
//           </div>

//           <AccordionContent className=" rounded-b-lg transition-all duration-300">
//   {actions.length > 0 ? (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
//       {actions.map((action, index) => (
//         <div
//           key={index}
//           className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
//         >
//           <Checkbox
//             checked={action.selected}
//             onCheckedChange={(isChecked) =>
//               onActionChange(index, isChecked as boolean)
//             }
//           />
//   <Label
//   className="text-sm text-gray-800 dark:text-gray-200 truncate max-w-[100px]"
//   title={action.actionName}
// >
//   {action.actionName}
// </Label>

//         </div>
//       ))}
//     </div>
//   ) : (
//     <div className="p-4 text-gray-500 dark:text-gray-400 italic">
//       No actions available for this permission.
//     </div>
//   )}
// </AccordionContent>

//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// };

// export default RolePermissionCard;


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface RolePermissionCardProps {
  permissionsName: string;
  actions: { actionName: string; selected: boolean }[];
  selected: boolean;
  onPermissionChange: (isChecked: boolean) => void;
  onActionChange: (index: number, isChecked: boolean) => void;
}

const RolePermissionCard: React.FC<RolePermissionCardProps> = ({
  permissionsName,
  actions,
  selected,
  onPermissionChange,
  onActionChange,
}) => {
  return (
    <div className="rounded-lg border shadow-md bg-muted">
      <Accordion type="single" collapsible>
        <AccordionItem value={permissionsName}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={selected}
                onCheckedChange={(checked) =>
                  onPermissionChange(checked)
                }
              />

              <span
                className="font-semibold text-sm truncate max-w-40"
                title={permissionsName}
              >
                {permissionsName}
              </span>
            </div>

            <AccordionTrigger className="text-sm text-primary">
              Actions
            </AccordionTrigger>
          </div>

          <AccordionContent>
            {actions.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-background p-2 rounded border"
                  >
                    <Checkbox
                      checked={action.selected}
                      onCheckedChange={(checked) =>
                        onActionChange(index, checked as boolean)
                      }
                    />
                    <Label
                      className="text-sm truncate"
                      title={action.actionName}
                    >
                      {action.actionName}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-muted-foreground italic">
                No actions available
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RolePermissionCard;

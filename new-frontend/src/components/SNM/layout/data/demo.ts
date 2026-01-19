// import { SidebarData } from "../types";

// export const applyPermissionToSidebar = (
//   sidebarData: SidebarData,
//   routes: Record<string, any[] | null>
// ): SidebarData => {
//   const selectedPermissions = Object.values(routes || {})
//     .flat()
//     .filter((item): item is { navigationUrl: string; permissionsName: string } =>
//       item && item.selected
//     );

//   const isAllowed = (title: string, url: string): boolean => {
//     return selectedPermissions.some(
//       (perm) => perm.permissionsName === title && perm.navigationUrl === url
//     );
//   };

//  const filteredSidebar: SidebarData = {
//     ...sidebarData,
//     navGroups: sidebarData.navGroups
//       .map((group) => {
//         if (group.title === 'Other') {
//           return group;
//         }

//         return {
//           ...group,
//           items: group.items
//             .map((item) => {
//               if (!item.items) {
//                 return isAllowed(item.title, item.url!) ? item : null;
//               }

//               const visibleSubItems = item.items.filter((subItem) =>
//                 isAllowed(subItem.title, subItem.url!)
//               );

//               return visibleSubItems.length > 0
//                 ? { ...item, items: visibleSubItems }
//                 : null;
//             })
//             .filter((item): item is Exclude<typeof item, null> => item !== null),
//         };
//       })
//       .filter((group) => group.title === 'Other' || group.items.length > 0),
//   };

//   return filteredSidebar;
// };

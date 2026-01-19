// import {
//   LayoutDashboard,
//   Users,
//   Package,
//   Monitor,
//   Settings,
//   FileText,
//   Shuffle,
//   Layers3,
//   BarChart2,
//   CheckSquare,
//   UserCheck,
//   User,
//   Factory,
// } from 'lucide-react';

// import { type SidebarData } from '../types';

// const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
// const { emailId = '', firstName = '', lastName = '' } = userInfo;

// const sidebarData: SidebarData = {
//   user: {
//     name: `${firstName} ${lastName}`,
//     email: emailId,
//     avatar: '/avatars/shadcn.jpg',
//   },
//   teams: [
//     {
//       name: 'Fuelster',
//       logo: Factory,
//       plan: '',
//     },
//   ],
//   navGroups: [
//     {
//       title: 'General',
//       items: [
//         {
//           title: 'Dashboard',
//           url: '/',
//           icon: LayoutDashboard,
//         },
//       ],
//     },
//     {
//       title: 'General Tools',
//       items: [
//         {
//           title: 'Master',
//           icon: Package,
//           items: [
//             {
//               title: 'Machines',
//               url: '/machines/page',
//               icon: Monitor,
//             },
//           ],
//         },
//         {
//           title: 'Transaction',
//           icon: Shuffle,
//           items: [
//             {
//               title: 'Sale Invoices',
//               url: '/sale-invoice',
//               icon: FileText,
//             },
//           ],
//         },
//         {
//           title: 'Stocks',
//           icon: Layers3,
//           items: [
//             {
//               title: 'Stocking',
//               url: '/stocking',
//               icon: Layers3,
//             },
//           ],
//         },
//         {
//           title: 'Report',
//           icon: BarChart2,
//           items: [
//             {
//               title: 'Stocking Report',
//               url: '/stockingReport',
//               icon: FileText,
//             },
//           ],
//         },
//         {
//           title: 'Checker',
//           icon: CheckSquare,
//           items: [
//             {
//               title: 'User Checker',
//               url: '/checker-user',
//               icon: UserCheck,
//             },
//           ],
//         },
//         {
//           title: 'Configuration',
//           icon: Settings,
//           items: [
//             {
//               title: 'Users',
//               url: '/users',
//               icon: Users,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       title: 'Other',
//       items: [
//         {
//           title: 'Settings',
//           icon: Settings,
//           items: [
//             {
//               title: 'Profile',
//               url: '/settings',
//               icon: User,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// // Visibility Logic (unchanged)
// const isItemVisible = (groupTitle: string, itemTitle: string, subItemTitle?: string): boolean => {
//   try {
//     const preferences = JSON.parse(localStorage.getItem('sidebarPreferences') || '[]');
//     const itemId = subItemTitle
//       ? `${groupTitle}-${itemTitle}-${subItemTitle}`
//       : `${groupTitle}-${itemTitle}`;
//     if (!preferences.length) return true;
//     return preferences.includes(itemId);
//   } catch {
//     return true;
//   }
// };

// const filterVisibleItems = (data: SidebarData): SidebarData => {
//   const filteredData = { ...data };
//   filteredData.navGroups = data.navGroups.map(group => ({
//     ...group,
//     items: group.items
//       .filter(item => {
//         if (!item.items) return isItemVisible(group.title, item.title);
//         const visibleSubItems = item.items.filter(subItem =>
//           isItemVisible(group.title, item.title, subItem.title)
//         );
//         if (visibleSubItems.length > 0) {
//           item.items = visibleSubItems;
//           return true;
//         }
//         return isItemVisible(group.title, item.title);
//       })
//       .filter(Boolean),
//   })).filter(group => group.items.length > 0);
//   return filteredData;
// };

// export const updateSidebar = () => {
//   window.dispatchEvent(new CustomEvent('sidebarDataChanged'));
// };

// export const getSidebarData = (): SidebarData => {
//   return filterVisibleItems(sidebarData);
// };

// if (typeof window !== 'undefined') {
//   window.addEventListener('sidebarPreferencesChanged', () => {
//     window.dispatchEvent(new CustomEvent('sidebarDataChanged'));
//   });
// }

// export { sidebarData };

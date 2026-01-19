// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from '@/components/ui/sidebar'
// // import { sidebarData } from './data/sidebar-data'
// import { getSidebarData } from './data/sidebar-data'
// import { useEffect, useState } from 'react'
// import { TeamSwitcher } from './team-switcher';
// import { NavGroup } from './nav-group';
// import { NavUser } from './nav-user';

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const [sidebarData, setSidebarData] = useState(getSidebarData());

//   useEffect(() => {
//     const handler = () => setSidebarData(getSidebarData());
//     window.addEventListener('sidebarDataChanged', handler);
//     return () => window.removeEventListener('sidebarDataChanged', handler);
//   }, []);
 

 

//   return (
    
//     <Sidebar collapsible='icon' variant='floating' {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={sidebarData.teams} />
//       </SidebarHeader>
//       <SidebarContent>
//         {sidebarData.navGroups.map((props) => (
//           <NavGroup key={props.title} {...props} />
//         ))}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={sidebarData.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   )
// }

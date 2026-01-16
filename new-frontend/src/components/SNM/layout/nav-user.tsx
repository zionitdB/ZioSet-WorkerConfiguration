// import { useNavigate } from 'react-router-dom' // ✅ React Router
// import {
//   ChevronsUpDown,
//   LogOut,
// } from 'lucide-react'

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from '@/components/ui/sidebar'

// import { useUserInfo } from './luserInfo'

// export function NavUser({
//   user,
// }: {
//   user: {
//     name: string
//     email: string
//     avatar: React.ReactNode | string
//     avatarUrl?: string
//     initials?: string
//   }
// }) {
//   const { isMobile } = useSidebar()
//   const navigate = useNavigate() // ✅ React Router navigate
//   const { emailId, firstName, lastName } = useUserInfo()

//   function handleLogout() {
//     localStorage.removeItem('userInfo')
//     localStorage.removeItem('authToken')
//     navigate('/sign-in') // ✅ Correct syntax
//   }

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size='lg'
//               className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
//             >
//               {typeof user.avatar === 'string' ? (
//                 <Avatar className='h-8 w-8 rounded-lg'>
//                   <AvatarImage src='/avatars/shadcn.jpg' alt={firstName} />
//                   <AvatarFallback className='rounded-lg'>
//                     {user.initials || 'U'}
//                   </AvatarFallback>
//                 </Avatar>
//               ) : (
//                 user.avatar
//               )}
//               <div className='grid flex-1 text-left text-sm leading-tight'>
//                 <span className='truncate font-semibold'>
//                   {(firstName || '') + ' ' + (lastName || '')}
//                 </span>
//                 <span className='truncate text-xs'>{emailId}</span>
//               </div>
//               <ChevronsUpDown className='ml-auto size-4' />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
//             side={isMobile ? 'bottom' : 'right'}
//             align='end'
//             sideOffset={4}
//           >
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout}>
//               <LogOut />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }

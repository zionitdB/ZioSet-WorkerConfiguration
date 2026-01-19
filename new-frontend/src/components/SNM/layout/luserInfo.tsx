// import { useState, useEffect } from 'react'

// type UserInfo = {
//   emailId?: string
//   firstName?: string
//   lastName?: string
//   role?: {
//     roleId?: string
//   }
// }

// export const useUserInfo = () => {
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem('userInfo')
//       if (stored) {
//         try {
//           const parsed = JSON.parse(stored)
//           setUserInfo(parsed)
//         } catch (err) {
//           console.error('Invalid userInfo in localStorage:', err)
//         }
//       }
//       setIsLoading(false)
//     }
//   }, [])

//   return {
//     userInfo,
//     isLoading,
//     emailId: userInfo?.emailId,
//     firstName: userInfo?.firstName,
//     lastName: userInfo?.lastName,
//     roleId: userInfo?.role?.roleId,
//   }
// }

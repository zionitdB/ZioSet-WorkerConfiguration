// App.tsx
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { GlobalUIProvider } from './components/context/global-ui-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import router from './components/auth/routes'
import { FontProvider } from './components/context/font-context'
import { ThemeSwitcher } from './components/layout/Customization/themeSwitcher'
import { BorderRadiusProvider } from './components/context/border-radius-context'
import { ThemeProviders } from './components/components/provider/theme-provider'
import { SettingsProvider } from './components/components/settingsContext'
import { PermissionsProvider } from './components/context/permission-context'
import { AuthProvider } from './components/context/auth-context'


function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      <GlobalUIProvider>
            <AuthProvider>
        <QueryClientProvider client={queryClient}> 
            <PermissionsProvider>
              <ThemeSwitcher hidden />
                  <SettingsProvider>
            <ThemeProviders>

         
              <BorderRadiusProvider>
          <FontProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <RouterProvider router={router} /> 
            <ReactQueryDevtools initialIsOpen={false} />
            
            </FontProvider>
            </BorderRadiusProvider>
               </ThemeProviders>
               </SettingsProvider>
               </PermissionsProvider>
        </QueryClientProvider>
        </AuthProvider>
      </GlobalUIProvider>
          </ThemeProvider>
    </>
  )
}

export default App;

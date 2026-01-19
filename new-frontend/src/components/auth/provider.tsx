"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { GlobalUIProvider } from '../context/global-ui-store';

export function Providers({ children }: { children: React.ReactNode }) {
  
  const [queryClient] = useState(() => new QueryClient()); // Create an instance of QueryClient

  return (
    <GlobalUIProvider>
    <QueryClientProvider client={queryClient}> 
    {/* <AuthProvider>
    <AuthGuard>
          <FormProvider> */}
{/* Use queryClient instance here */}
    {/* <PermissionsProvider> */}
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <Toaster  position="top-right" reverseOrder={false}/>
   
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
  
    </ThemeProvider>
    {/* </PermissionsProvider>
    </FormProvider>
    </AuthGuard>
    </AuthProvider> */}
    </QueryClientProvider>
    </GlobalUIProvider>
  );
}


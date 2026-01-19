// src/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient(); 

  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}> {/* Use queryClient instance here */}
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </>
  );
}
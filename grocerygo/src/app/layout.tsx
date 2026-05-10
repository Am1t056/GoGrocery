import type { Metadata } from 'next';
import './globals.css';
import Provider from '@/providers/Provider';
import { Toaster } from 'react-hot-toast';
import StoreProvider from '@/redux/StoreProvider';
// import useGetAuthenticatedUser from '@/hooks/useGetAuthenticatedUser';
import AuthenticatedUser from '@/components/common/AuthenticatedUser';

export const metadata: Metadata = {
  title: 'GroceryGo | 10 minutes grocery delivery app',
  description: '10 min grocery delivery app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className=" w-full min-h-screen bg-linear-to-b from-green-50 to-white">
        <Provider>
          <StoreProvider>
            <AuthenticatedUser/>
          {children}
          </StoreProvider>
          </Provider>
        <Toaster/>
      </body>
    </html>
  );
}

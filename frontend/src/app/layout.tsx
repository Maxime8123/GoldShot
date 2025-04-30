'use client';

import Layout from '@/components/layout/Layout';
import { Providers } from '@/providers';
import WalletProvider from '@/providers/WalletProvider';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <WalletProvider>
            <Layout>
              {children}
            </Layout>
            <Toaster position="top-right" />
          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}

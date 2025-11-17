import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/hooks/use-i18n';
import { MainLayout } from '@/components/main-layout';

// This metadata is now a fallback, the actual title is set in MainLayout
export const metadata: Metadata = {
  title: 'Secret Santa Organizer',
  description: 'Organize your secret santa in a fun and easy way.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <I18nProvider>
      <MainLayout>
        {children}
        <Toaster />
      </MainLayout>
    </I18nProvider>
  );
}

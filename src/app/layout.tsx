import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/hooks/use-i18n';
import { MainLayout } from '@/components/main-layout';

export const metadata: Metadata = {
  title: 'Secret Santa Organizer',
  description: 'Organize your secret santa in a fun and easy way.',
  icons: {
    icon: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='hsl(277, 71%, 60%)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 12v10H4V12' /><path d='M2 7h20v5H2z' /><path d='M12 22V7' /><path d='M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z' /><path d='M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' /></svg>`,
  },
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

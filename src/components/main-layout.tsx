"use client";

import { useEffect } from "react";
import { useI18n } from "@/hooks/use-i18n";

export function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t, language } = useI18n();

  useEffect(() => {
    document.title = t('app_name');
    document.documentElement.lang = language;
  }, [t, language]);

  return (
    <html lang={language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
          {children}
      </body>
    </html>
  );
}

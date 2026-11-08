import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { fontVariables } from '@/lib/fonts';
import { ThemeProvider } from '@/providers';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'নজরুল সিটি | জমি, প্লট ও ফ্ল্যাট কেনা-বেচা',
    template: '%s | নজরুল সিটি',
  },
  description: SITE_CONFIG.description,
  openGraph: {
    locale: 'bn_BD',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn-BD"
      className={`${fontVariables} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

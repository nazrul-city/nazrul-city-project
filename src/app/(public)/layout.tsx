import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/providers';
import { fontVariables } from '@/lib/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Jakirul Islam Hakim | Portfolio',
  description: 'Personal portfolio of Jakirul Islam Hakim - Full Stack Web Developer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/providers';
import { fontVariables } from '@/lib/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nazrul City | Buy & Sell Land, Plots & Flats',
    template: '%s | Nazrul City',
  },
  description:
    'Nazrul City is a real estate business. We buy and sell land, plots, and flats/units with clear, straightforward deals.',
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

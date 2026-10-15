import { Hind_Siliguri, Inter, Manrope, Noto_Sans_Bengali } from 'next/font/google';

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500'],
});

export const fontHeading = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const fontHindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  variable: '--font-hind-siliguri',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontNotoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  variable: '--font-noto-sans-bengali',
  display: 'swap',
});

export const fontVariables = `${fontSans.variable} ${fontHeading.variable} ${fontHindSiliguri.variable} ${fontNotoSansBengali.variable}`;

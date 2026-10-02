export const SITE_CONFIG = {
  name: 'Nazrul City',
  tagline: 'আমাদের সিটি, শান্তির ঘাঁটি',
  description:
    'রিয়েল এস্টেট ব্যবসা — যাচাই করা জমি, প্লট ও ফ্ল্যাট কেনা-বেচা, সৎ দাম এবং পরিষ্কার কাগজপত্রসহ।',
  contact: {
    phones: ['01837777777', '01910100100'],
    email: 'info@nazrulcity.com',
    address: 'Nijhum Plaza, 105 A.B. Guha Road, Ganginarpar, Mymensingh 2200, Bangladesh',
    whatsapp: '01910100100',
  },
  social: {
    facebook: 'https://www.facebook.com/nazrulcity1',
    instagram: 'https://instagram.com/nazrulcity',
    youtube: 'https://youtube.com/@nazrulcity',
  },
} as const;

export const PUBLIC_NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'How we work', href: '#how-we-work' },
  { label: 'Contact', href: '#contact' },
] as const;

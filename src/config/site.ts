export const SITE_CONFIG = {
  name: 'Nazrul City',
  tagline: 'আমাদের সিটি, শান্তির ঘাঁটি',
  description:
    'রিয়েল এস্টেট ব্যবসা — যাচাই করা জমি, প্লট ও ফ্ল্যাট কেনা-বেচা, সৎ দাম এবং পরিষ্কার কাগজপত্রসহ।',
  contact: {
    phones: ['01837777777', '01910100100'],
    email: 'info@nazrulcity.com',
    // address: 'Nijhum Plaza, 105 A.B. Guha Road, Ganginarpar, Mymensingh 2200, Bangladesh',
    address: 'নিঝুম প্লাজা, ১০৫ এ.বি. গুহ রোড, গাঙ্গিনার পার রোড, ময়মনসিংহ ২২০০, বাংলাদেশ',
    whatsapp: '01910100100',
    hours: {
      days: 'প্রতিদিন',
      time: '8:00AM –  11:00PM',
      openHour: 8,
      closeHour: 23,
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.1235088439935!2d90.40393598982594!3d24.756954102641693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37564f6f6883cd73%3A0x7644d4cc6179a23d!2sNazrul%20City%20(Corporate%20Office)!5e0!3m2!1sen!2sbd!4v1791367974671!5m2!1sen!2sbd',
  },
  social: {
    facebook: 'https://www.facebook.com/nazrulcity1',
    instagram: 'https://instagram.com/nazrulcity',
    youtube: 'https://youtube.com/@nazrulcity',
  },
} as const;

export const PUBLIC_NAV_ITEMS = [
  { label: 'আমাদের সম্পর্কে', href: '/about-us' },
  { label: 'সেবাসমূহ', href: '#services' },
  { label: 'প্লট ও ফ্ল্যাট', href: '#projects' },
  { label: 'কাজের পদ্ধতি', href: '#how-we-work' },
  { label: 'যোগাযোগ', href: '#contact' },
] as const;

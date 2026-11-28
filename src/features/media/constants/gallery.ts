import type { TCategoryFilter } from '../types/gallery-photo';

export const GALLERY_CATEGORIES: readonly { value: TCategoryFilter; label: string }[] = [
  { value: 'ALL', label: 'সব' },
  { value: 'PROJECT_VISIT', label: 'প্রকল্প পরিদর্শন' },
  { value: 'REGISTRATION', label: 'রেজিস্ট্রেশন ও দলিল' },
  { value: 'BOOKING', label: 'বুকিং মুহূর্ত' },
  { value: 'CUSTOMER_MOMENTS', label: 'গ্রাহক সন্তুষ্টি' },
  { value: 'PROJECT_ACTIVITIES', label: 'উন্নয়ন কার্যক্রম' },
  { value: 'CORPORATE', label: 'কর্পোরেট' },
] as const;

export const ADMIN_GALLERY_CATEGORIES = GALLERY_CATEGORIES.filter(
  (c) => c.value !== 'ALL'
) as readonly { value: Exclude<TCategoryFilter, 'ALL'>; label: string }[];

export const MEDIA_PREVIEW_PHOTO_COUNT = 8;
export const GALLERY_PAGE_LIMIT = 20;

export type TGalleryCategory =
  | 'PROJECT_VISIT'
  | 'REGISTRATION'
  | 'BOOKING'
  | 'CUSTOMER_MOMENTS'
  | 'PROJECT_ACTIVITIES'
  | 'CORPORATE';

export type TGalleryPhoto = {
  id: string;
  title: string;
  dateTaken: string;
  category: TGalleryCategory;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TCategoryFilter = TGalleryCategory | 'ALL';

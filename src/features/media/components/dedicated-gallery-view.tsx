import type { TCategoryFilter, TGalleryPhoto } from '../types/gallery-photo';
import { GalleryCategorySelect } from './gallery-category-select';
import { GalleryPagination } from './gallery-pagination';
import { GalleryPhotoGrid } from './gallery-photo-grid';

type TDedicatedGalleryViewProps = {
  photos: readonly TGalleryPhoto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentCategory: TCategoryFilter;
  limit: number;
};

export function DedicatedGalleryView({
  photos,
  totalCount,
  totalPages,
  currentPage,
  currentCategory,
  limit,
}: Readonly<TDedicatedGalleryViewProps>) {
  return (
    <div className="flex flex-col">
      {/* Category Filter Select & Count Row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <GalleryCategorySelect currentCategory={currentCategory} />

        {/* Results Count Summary  */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
          <span>মোট {totalCount}টি ছবি</span>
          {totalPages > 1 ? (
            <>
              <span>·</span>
              <span>
                পৃষ্ঠা {currentPage} / {totalPages}
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Grid of Photos */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <p className="text-sm md:text-base">এই ক্যাটাগরিতে এখনও কোনো ছবি যুক্ত করা হয়নি।</p>
        </div>
      ) : (
        <GalleryPhotoGrid photos={photos} />
      )}

      {/* Pagination Controls  */}
      <GalleryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        category={currentCategory}
        limit={limit}
        basePath="/media/gallery"
      />
    </div>
  );
}

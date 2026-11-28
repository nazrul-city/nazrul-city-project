'use client';

import type { TFacebookReel } from '@/features/media/types/facebook-reel';
import { ReelAdminRow } from './reel-admin-row';

type TReelAdminListProps = {
  reels: readonly TFacebookReel[];
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (reel: TFacebookReel) => void;
};

export function ReelAdminList({ reels, onMove, onDelete, onEdit }: Readonly<TReelAdminListProps>) {
  if (reels.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        কোনো ফেসবুক রিলস যুক্ত করা হয়নি। উপরের ফর্ম থেকে সর্বোচ্চ ৫টি রিলস যুক্ত করুন।
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {reels.map((reel, index) => (
        <ReelAdminRow
          key={reel.id}
          reel={reel}
          index={index}
          total={reels.length}
          onMove={onMove}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

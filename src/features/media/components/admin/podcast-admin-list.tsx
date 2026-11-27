'use client';

import type { TPodcast } from '@/features/media/types/podcast';
import { PodcastAdminRow } from './podcast-admin-row';

type TPodcastAdminListProps = {
  podcasts: readonly TPodcast[];
  publishedCount: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (podcast: TPodcast) => void;
  onVisibilityToggle: (id: string, published: boolean) => void;
};

export function PodcastAdminList({
  podcasts,
  publishedCount,
  onMove,
  onDelete,
  onEdit,
  onVisibilityToggle,
}: Readonly<TPodcastAdminListProps>) {
  if (podcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
        <p className="text-sm sm:text-base">এখনও কোনো পডকাস্ট বা সাক্ষাৎকার যোগ করা হয়নি।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {podcasts.map((podcast, index) => (
        <PodcastAdminRow
          key={podcast.id}
          podcast={podcast}
          index={index}
          total={podcasts.length}
          publishedCount={publishedCount}
          onMove={onMove}
          onDelete={onDelete}
          onEdit={onEdit}
          onVisibilityToggle={onVisibilityToggle}
        />
      ))}
    </div>
  );
}

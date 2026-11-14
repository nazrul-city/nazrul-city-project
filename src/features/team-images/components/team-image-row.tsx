'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DeleteTeamImageDialog } from '@/features/team-images/components/delete-team-image-dialog';
import type { TTeamImage } from '@/features/team-images/types/team-image';

type TTeamImageRowProps = {
  image: TTeamImage;
  index: number;
  total: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
};

export function TeamImageRow({
  image,
  index,
  total,
  onMove,
  onDelete,
}: Readonly<TTeamImageRowProps>) {
  function handleMoveUp() {
    onMove(index, index - 1);
  }

  function handleMoveDown() {
    onMove(index, index + 1);
  }

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 md:flex-row md:items-center">
      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg md:w-28">
        <Image
          src={image.imageUrl}
          alt={image.caption}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      <p className="flex-1 text-sm font-medium text-foreground">{image.caption}</p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" disabled={isFirst} onClick={handleMoveUp}>
          Move up
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLast}
          onClick={handleMoveDown}
        >
          Move down
        </Button>

        <DeleteTeamImageDialog image={image} onDeleted={onDelete} />
      </div>
    </li>
  );
}

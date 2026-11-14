import { TeamImageRow } from '@/features/team-images/components/team-image-row';
import type { TTeamImage } from '@/features/team-images/types/team-image';

type TTeamImageListProps = {
  images: readonly TTeamImage[];
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
};

export function TeamImageList({ images, onMove, onDelete }: Readonly<TTeamImageListProps>) {
  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet. Upload one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {images.map((image, index) => (
        <TeamImageRow
          key={image.id}
          image={image}
          index={index}
          total={images.length}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

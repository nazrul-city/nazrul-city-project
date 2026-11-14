'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteTeamImageAction } from '@/features/team-images/actions';
import type { TTeamImage } from '@/features/team-images/types/team-image';

type TDeleteTeamImageDialogProps = {
  image: TTeamImage;
  onDeleted: (id: string) => void;
};

export function DeleteTeamImageDialog({ image, onDeleted }: Readonly<TDeleteTeamImageDialogProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleOpenChange(open: boolean) {
    if (isDeleting) {
      return;
    }

    setIsOpen(open);

    if (!open) {
      setErrorMessage(null);
    }
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setErrorMessage(null);

    const result = await deleteTeamImageAction(image.id);

    setIsDeleting(false);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setIsOpen(false);
    onDeleted(image.id);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="destructive" size="sm" disabled={isDeleting}>
            Delete
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the photo from Cloudinary and the About page. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage ? (
          <p role="alert" className="text-base text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
          >
            {isDeleting ? 'Deleting…' : 'Delete photo'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

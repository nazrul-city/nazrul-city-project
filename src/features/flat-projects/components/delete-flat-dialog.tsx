'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { deleteFlat } from '@/features/flat-projects/actions';

type TDeleteFlatDialogProps = {
  flatId: string;
  name: string;
};

export function DeleteFlatDialog({ flatId, name }: Readonly<TDeleteFlatDialogProps>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const result = await deleteFlat(flatId);
    setIsDeleting(false);

    if (!result.ok) {
      setErrorMessage('message' in result ? result.message : 'That flat could not be deleted.');
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button type="button" variant="destructive" />}>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this flat?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes {name}. It will disappear from the public flats page. This
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
            {isDeleting ? 'Deleting…' : 'Delete flat'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
import { deletePlot } from '@/features/land-projects/actions';

type TDeletePlotDialogProps = {
  plotId: string;
  name: string;
};

export function DeletePlotDialog({ plotId, name }: Readonly<TDeletePlotDialogProps>) {
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
    const result = await deletePlot(plotId);
    setIsDeleting(false);

    if (!result.ok) {
      setErrorMessage('message' in result ? result.message : 'That plot could not be deleted.');
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
          <AlertDialogTitle>Delete this plot?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes {name}. It will disappear from the public plots page. This
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
            {isDeleting ? 'Deleting…' : 'Delete plot'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

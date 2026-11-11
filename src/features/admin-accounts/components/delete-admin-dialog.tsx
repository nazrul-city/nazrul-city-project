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
import { deleteAdmin } from '@/features/admin-accounts/actions/delete-admin';
import type { TAdminAccount } from '@/features/admin-accounts/types/admin-account';

type TDeleteAdminDialogProps = {
  account: TAdminAccount;
};

export function DeleteAdminDialog({ account }: Readonly<TDeleteAdminDialogProps>) {
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

    const result = await deleteAdmin(account.id);

    setIsDeleting(false);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button type="button" variant="destructive" />}>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this admin?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes {account.name} ({account.email}). They will not be able to sign
            in. This cannot be undone.
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
            {isDeleting ? 'Deleting…' : 'Delete admin'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

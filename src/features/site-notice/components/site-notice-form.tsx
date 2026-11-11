'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SaveSuccessDialog } from '@/components/shared/save-success-dialog';
import { updateSiteNotice } from '@/features/site-notice/actions';
import {
  siteNoticeFormSchema,
  type TSiteNoticeFieldErrors,
  type TSiteNoticeFormValues,
} from '@/features/site-notice/components/site-notice-form-schema';

const FIELD_CLASS_NAME = 'min-h-28 w-full text-base md:text-base';

type TSiteNoticeFormProps = {
  defaultValues: TSiteNoticeFormValues;
};

type TFormFieldProps = {
  id: string;
  label: string;
  errorId: string;
  errorMessage?: string;
  children: ReactNode;
};

function FormField({ id, label, errorId, errorMessage, children }: Readonly<TFormFieldProps>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium text-foreground">
        {label}
      </label>
      {children}
      {errorMessage ? (
        <p id={errorId} className="text-base text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export function SiteNoticeForm({ defaultValues }: Readonly<TSiteNoticeFormProps>) {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TSiteNoticeFormValues>({
    resolver: zodResolver(siteNoticeFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  function applyFieldErrors(fieldErrors: TSiteNoticeFieldErrors) {
    for (const field of Object.keys(fieldErrors) as (keyof TSiteNoticeFieldErrors)[]) {
      const message = fieldErrors[field];

      if (message) {
        setError(field, { message });
      }
    }
  }

  function handleSuccessClose() {
    setSuccessMessage(null);
  }

  async function onSubmit(values: TSiteNoticeFormValues) {
    setFormError(null);

    const result = await updateSiteNotice(values);

    if (!result.ok) {
      if ('fieldErrors' in result) {
        applyFieldErrors(result.fieldErrors);
        return;
      }

      setFormError(result.message);
      return;
    }

    setSuccessMessage('Hero notice saved.');
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex max-w-2xl flex-col gap-6">
        <FormField
          id="site-notice-message"
          label="Marquee message"
          errorId="site-notice-message-error"
          errorMessage={errors.message?.message}
        >
          <Textarea
            id="site-notice-message"
            autoComplete="off"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'site-notice-message-error' : undefined}
            className={FIELD_CLASS_NAME}
            {...register('message')}
          />
        </FormField>

        <p className="text-sm text-muted-foreground">
          This text scrolls across the home hero (max 200 characters). Include phone numbers in the
          message if you want them shown.
        </p>

        <label className="flex min-h-11 items-center gap-3 text-base">
          <input
            type="checkbox"
            className="size-4"
            disabled={isSubmitting}
            {...register('isEnabled')}
          />
          Show on homepage
        </label>

        {formError ? (
          <p role="alert" className="text-base text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save notice'}
        </Button>
      </form>
      <SaveSuccessDialog message={successMessage} onClose={handleSuccessClose} />
    </>
  );
}

'use client';

import { useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SaveSuccessDialog } from '@/components/shared/save-success-dialog';
import { updateSiteContact } from '@/features/site-contact/actions';
import {
  siteContactFormSchema,
  type TSiteContactField,
  type TSiteContactFieldErrors,
  type TSiteContactFormValues,
} from '@/features/site-contact/components/site-contact-form-schema';

const FIELD_CLASS_NAME = 'h-11 w-full text-base md:text-base';

const SITE_CONTACT_FORM_FIELDS = [
  { name: 'primaryPhone', label: 'Primary phone', type: 'tel', autoComplete: 'tel' },
  { name: 'secondaryPhone', label: 'Secondary phone', type: 'tel', autoComplete: 'tel' },
  { name: 'whatsapp', label: 'WhatsApp number', type: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
] as const satisfies readonly {
  name: TSiteContactField;
  label: string;
  type: 'tel' | 'email';
  autoComplete: string;
}[];

type TSiteContactFieldConfig = (typeof SITE_CONTACT_FORM_FIELDS)[number];

type TSiteContactFormProps = {
  defaultValues: TSiteContactFormValues;
};

type TSiteContactInputProps = {
  field: TSiteContactFieldConfig;
  registration: UseFormRegisterReturn;
  errorMessage?: string;
  isDisabled: boolean;
};

function SiteContactInput({
  field,
  registration,
  errorMessage,
  isDisabled,
}: Readonly<TSiteContactInputProps>) {
  const id = `site-contact-${field.name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium text-foreground">
        {field.label}
      </label>
      <Input
        id={id}
        type={field.type}
        inputMode={field.type}
        autoComplete={field.autoComplete}
        disabled={isDisabled}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
        className={FIELD_CLASS_NAME}
        {...registration}
      />
      {errorMessage ? (
        <p id={errorId} className="text-base text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export function SiteContactForm({ defaultValues }: Readonly<TSiteContactFormProps>) {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TSiteContactFormValues>({
    resolver: zodResolver(siteContactFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  function applyFieldErrors(fieldErrors: TSiteContactFieldErrors) {
    for (const field of SITE_CONTACT_FORM_FIELDS) {
      const message = fieldErrors[field.name];

      if (message) {
        setError(field.name, { message });
      }
    }
  }

  function handleSuccessClose() {
    setSuccessMessage(null);
  }

  async function onSubmit(values: TSiteContactFormValues) {
    setFormError(null);

    const result = await updateSiteContact(values);

    if (!result.ok) {
      if ('fieldErrors' in result) {
        applyFieldErrors(result.fieldErrors);
        return;
      }

      setFormError(result.message);
      return;
    }

    setSuccessMessage('Contact details saved.');
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex max-w-2xl flex-col gap-6">
        {SITE_CONTACT_FORM_FIELDS.map((field) => (
          <SiteContactInput
            key={field.name}
            field={field}
            registration={register(field.name)}
            errorMessage={errors[field.name]?.message}
            isDisabled={isSubmitting}
          />
        ))}

        <p className="text-sm text-muted-foreground">
          Enter numbers in international format with the country code (for example +8801837777777).
          The primary phone is used for every Call button on the website.
        </p>

        {formError ? (
          <p role="alert" className="text-base text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save contact details'}
        </Button>
      </form>
      <SaveSuccessDialog message={successMessage} onClose={handleSuccessClose} />
    </>
  );
}

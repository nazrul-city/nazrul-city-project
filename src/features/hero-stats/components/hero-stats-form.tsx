'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SaveSuccessDialog } from '@/components/shared/save-success-dialog';
import { updateHeroStats } from '@/features/hero-stats/actions';
import {
  heroStatsFormSchema,
  type THeroStatsFieldErrors,
  type THeroStatsFormValues,
} from '@/features/hero-stats/components/hero-stats-form-schema';

const FIELD_CLASS_NAME = 'h-11 w-full text-base md:text-base';

type THeroStatsFormProps = {
  defaultValues: THeroStatsFormValues;
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

export function HeroStatsForm({ defaultValues }: Readonly<THeroStatsFormProps>) {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<THeroStatsFormValues>({
    resolver: zodResolver(heroStatsFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  function applyFieldErrors(fieldErrors: THeroStatsFieldErrors) {
    for (const field of Object.keys(fieldErrors) as (keyof THeroStatsFieldErrors)[]) {
      const message = fieldErrors[field];

      if (message) {
        setError(field, { message });
      }
    }
  }

  function handleSuccessClose() {
    setSuccessMessage(null);
  }

  async function onSubmit(values: THeroStatsFormValues) {
    setFormError(null);

    const result = await updateHeroStats(values);

    if (!result.ok) {
      if ('fieldErrors' in result) {
        applyFieldErrors(result.fieldErrors);
        return;
      }

      setFormError(result.message);
      return;
    }

    setSuccessMessage('Hero stats saved.');
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex max-w-2xl flex-col gap-6">
        <FormField
          id="hero-stats-plots-sold"
          label="Plots sold"
          errorId="hero-stats-plots-sold-error"
          errorMessage={errors.plotsSold?.message}
        >
          <Input
            id="hero-stats-plots-sold"
            autoComplete="off"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.plotsSold)}
            aria-describedby={errors.plotsSold ? 'hero-stats-plots-sold-error' : undefined}
            className={FIELD_CLASS_NAME}
            {...register('plotsSold')}
          />
        </FormField>

        <FormField
          id="hero-stats-happy-clients"
          label="Happy clients"
          errorId="hero-stats-happy-clients-error"
          errorMessage={errors.happyClients?.message}
        >
          <Input
            id="hero-stats-happy-clients"
            autoComplete="off"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.happyClients)}
            aria-describedby={errors.happyClients ? 'hero-stats-happy-clients-error' : undefined}
            className={FIELD_CLASS_NAME}
            {...register('happyClients')}
          />
        </FormField>

        <FormField
          id="hero-stats-properties-listed"
          label="Properties listed"
          errorId="hero-stats-properties-listed-error"
          errorMessage={errors.propertiesListed?.message}
        >
          <Input
            id="hero-stats-properties-listed"
            autoComplete="off"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.propertiesListed)}
            aria-describedby={
              errors.propertiesListed ? 'hero-stats-properties-listed-error' : undefined
            }
            className={FIELD_CLASS_NAME}
            {...register('propertiesListed')}
          />
        </FormField>

        <p className="text-sm text-muted-foreground">
          Enter display values as they should appear (for example ২৫০+). The years-of-experience
          tile updates automatically from 2020 and is not editable here.
        </p>

        {formError ? (
          <p role="alert" className="text-base text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save stats'}
        </Button>
      </form>
      <SaveSuccessDialog message={successMessage} onClose={handleSuccessClose} />
    </>
  );
}

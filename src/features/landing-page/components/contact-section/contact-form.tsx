'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import {
  CONTACT_FORM_DEFAULT_VALUES,
  CONTACT_INTEREST_OPTIONS,
  contactFormSchema,
  type TContactFormValues,
} from '@/features/landing-page/components/contact-section/contact-form-schema';

const FIELD_CLASS_NAME = 'min-h-10 md:text-base';

export function ContactForm() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: CONTACT_FORM_DEFAULT_VALUES,
    // Check when they press send. After a field fails, clear that error as they fix it.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  function handleValidSubmit(values: TContactFormValues) {
    // TODO: Send the form data WhatsApp API using server

    console.warn(values);
    reset();
    setHasSubmitted(true);
  }

  function handleWriteAnother() {
    setHasSubmitted(false);
  }

  const handleFormSubmit = handleSubmit(handleValidSubmit);

  if (hasSubmitted) {
    return (
      <div
        id="contact-form"
        className="flex h-full flex-col justify-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:p-6"
      >
        <p role="status" className="text-base text-foreground">
          ধন্যবাদ। আমরা শীঘ্রই যোগাযোগ করব।
        </p>
        <Button type="button" variant="link" className="w-fit px-0" onClick={handleWriteAnother}>
          আরেকটি বার্তা লিখুন
        </Button>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      noValidate
      className="flex h-full flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:p-6"
      onSubmit={handleFormSubmit}
    >
      <h3>বার্তা</h3>

      <div className="mb-2 flex flex-col items-start gap-1 rounded-md bg-muted/40 px-3 py-2">
        <p className="font-medium text-foreground">আপনার স্বপ্নের বাড়ি নিয়ে কথা বলি</p>
        <span className="text-sm text-muted-foreground">ফর্মটি পূরণ করুন। আমরা যোগাযোগ করব।</span>
      </div>

      <ContactField
        id="contact-name"
        label="নাম"
        errorId="contact-name-error"
        errorMessage={errors.name?.message}
        isRequired
      >
        <Input
          id="contact-name"
          autoComplete="name"
          placeholder="রহিম উদ্দিন"
          className={FIELD_CLASS_NAME}
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
        />
      </ContactField>

      <ContactField
        id="contact-phone"
        label="মোবাইল নম্বর"
        errorId="contact-phone-error"
        errorMessage={errors.phone?.message}
        isRequired
      >
        <Input
          id="contact-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="01837777777"
          className={FIELD_CLASS_NAME}
          aria-required="true"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          {...register('phone')}
        />
      </ContactField>

      <ContactField
        id="contact-interest"
        label="আমি আগ্রহী"
        errorId="contact-interest-error"
        errorMessage={errors.interest?.message}
        isRequired
      >
        <NativeSelect
          id="contact-interest"
          className="w-full"
          selectClassName="h-11 text-base"
          aria-required="true"
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? 'contact-interest-error' : undefined}
          {...register('interest')}
        >
          {CONTACT_INTEREST_OPTIONS.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </ContactField>

      <ContactField
        id="contact-message"
        label="বার্তা"
        errorId="contact-message-error"
        errorMessage={errors.message?.message}
      >
        <Textarea
          id="contact-message"
          rows={4}
          placeholder="কী ধরনের প্লট বা ফ্ল্যাট খুঁজছেন? আপনার বাজেট কেমন?"

          className="min-h-24 md:text-base"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
        />
      </ContactField>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        বার্তা পাঠান
      </Button>
    </form>
  );
}

type TContactFieldProps = {
  id: string;
  label: string;
  errorId: string;
  errorMessage?: string;
  isRequired?: boolean;
  children: React.ReactNode;
};

function ContactField({
  id,
  label,
  errorId,
  errorMessage,
  isRequired = false,
  children,
}: Readonly<TContactFieldProps>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {isRequired ? (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
        {isRequired ? <span className="sr-only"> আবশ্যক</span> : null}
      </label>
      {children}
      {errorMessage ? (
        <p id={errorId} className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

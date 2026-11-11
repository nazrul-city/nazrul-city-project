'use client';

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import {
  ProjectImageField,
  readImageError,
  type TProjectImageUploader,
} from '@/components/shared/project-image-field';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { SaveSuccessDialog } from '@/components/shared/save-success-dialog';
import { createFlat, updateFlat } from '@/features/flat-projects/actions';
import {
  FLAT_CONSTRUCTION_OPTIONS,
  FLAT_FORM_DEFAULTS,
  FLAT_PROPERTY_OPTIONS,
  FLAT_STATUS_OPTIONS,
  flatFormSchema,
  type TFlatFieldErrors,
  type TFlatFormValues,
} from '@/features/flat-projects/components/flat-form-schema';

const FIELD_CLASS_NAME = 'min-h-11 w-full text-base md:text-base';

type TFlatFormProps =
  | { mode: 'create'; defaultValues?: TFlatFormValues }
  | { mode: 'edit'; flatId: string; defaultValues: TFlatFormValues };

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

export function FlatForm(props: Readonly<TFlatFormProps>) {
  const defaultValues = props.defaultValues ?? FLAT_FORM_DEFAULTS;
  const [formKey, setFormKey] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const uploaderRef = useRef<TProjectImageUploader | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TFlatFormValues>({
    resolver: zodResolver(flatFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const images = useWatch({ control, name: 'images' });
  const facilities = useWatch({ control, name: 'facilities' });

  function applyFieldErrors(fieldErrors: TFlatFieldErrors) {
    for (const field of Object.keys(fieldErrors) as (keyof TFlatFieldErrors)[]) {
      const message = fieldErrors[field];

      if (message) {
        setError(field, { message });
      }
    }
  }

  function handleImagesChange(nextImages: string[]) {
    setValue('images', nextImages, { shouldDirty: true, shouldValidate: true });
  }

  function handleFacilitiesChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValue('facilities', event.target.value.split('\n'), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleSuccessClose() {
    setSuccessMessage(null);
  }

  async function handleValidSubmit(values: TFlatFormValues) {
    setFormError(null);
    const images = await uploaderRef.current?.waitForUploads();

    if (!images) {
      setFormError('The image could not be uploaded. Choose it again, then save.');
      return;
    }

    const nextValues = { ...values, images: [...images] };
    const result =
      props.mode === 'create'
        ? await createFlat(nextValues)
        : await updateFlat(props.flatId, nextValues);

    if (!result.ok && 'fieldErrors' in result) {
      applyFieldErrors(result.fieldErrors);
      return;
    }

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    if (props.mode === 'create') {
      reset(FLAT_FORM_DEFAULTS);
      setFormKey((currentKey) => currentKey + 1);
      setSuccessMessage('Flat created.');
      return;
    }

    setSuccessMessage('Flat updated.');
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(handleValidSubmit)(event);
  }

  return (
    <>
      <form key={formKey} className="flex flex-col gap-6" noValidate onSubmit={handleFormSubmit}>
        {formError ? (
          <p role="alert" className="text-base text-destructive">
            {formError}
          </p>
        ) : null}

        <section className="flex flex-col gap-4">
          <h2>Identity</h2>
          <FormField
            id="flat-name"
            label="Name"
            errorId="flat-name-error"
            errorMessage={errors.name?.message}
          >
            <Input
              id="flat-name"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'flat-name-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('name')}
            />
          </FormField>
          <FormField
            id="flat-title"
            label="Title"
            errorId="flat-title-error"
            errorMessage={errors.title?.message}
          >
            <Input
              id="flat-title"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'flat-title-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('title')}
            />
          </FormField>
          <FormField
            id="flat-intro"
            label="Short intro"
            errorId="flat-intro-error"
            errorMessage={errors.shortIntro?.message}
          >
            <Input
              id="flat-intro"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.shortIntro)}
              aria-describedby={errors.shortIntro ? 'flat-intro-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('shortIntro')}
            />
          </FormField>
          <FormField
            id="flat-slug"
            label="Slug"
            errorId="flat-slug-error"
            errorMessage={errors.slug?.message}
          >
            <Input
              id="flat-slug"
              autoComplete="off"
              spellCheck={false}
              placeholder="lake-view-flat…"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? 'flat-slug-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('slug')}
            />
          </FormField>
          <FormField
            id="flat-type"
            label="Property type"
            errorId="flat-type-error"
            errorMessage={errors.propertyType?.message}
          >
            <NativeSelect
              id="flat-type"
              className="w-full"
              selectClassName={FIELD_CLASS_NAME}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.propertyType)}
              aria-describedby={errors.propertyType ? 'flat-type-error' : undefined}
              {...register('propertyType')}
            >
              {FLAT_PROPERTY_OPTIONS.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
        </section>

        <section className="flex flex-col gap-4">
          <h2>Location</h2>
          <FormField
            id="flat-address"
            label="Address"
            errorId="flat-address-error"
            errorMessage={errors.address?.message}
          >
            <Input
              id="flat-address"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? 'flat-address-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('address')}
            />
          </FormField>
          <FormField
            id="flat-district"
            label="District"
            errorId="flat-district-error"
            errorMessage={errors.district?.message}
          >
            <Input
              id="flat-district"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.district)}
              aria-describedby={errors.district ? 'flat-district-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('district')}
            />
          </FormField>
          <FormField
            id="flat-landmark"
            label="Landmark"
            errorId="flat-landmark-error"
            errorMessage={errors.landmark?.message}
          >
            <Input
              id="flat-landmark"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.landmark)}
              aria-describedby={errors.landmark ? 'flat-landmark-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('landmark')}
            />
          </FormField>
          <FormField
            id="flat-map"
            label="Map URL"
            errorId="flat-map-error"
            errorMessage={errors.mapEmbedLink?.message}
          >
            <Input
              id="flat-map"
              type="url"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.mapEmbedLink)}
              aria-describedby={errors.mapEmbedLink ? 'flat-map-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('mapEmbedLink')}
            />
          </FormField>
        </section>

        <section className="flex flex-col gap-4">
          <h2>Details</h2>
          <FormField
            id="flat-floors"
            label="Total floors"
            errorId="flat-floors-error"
            errorMessage={errors.buildingTotalFloors?.message}
          >
            <Input
              id="flat-floors"
              type="number"
              inputMode="numeric"
              min={1}
              max={200}
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.buildingTotalFloors)}
              aria-describedby={errors.buildingTotalFloors ? 'flat-floors-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('buildingTotalFloors', { valueAsNumber: true })}
            />
          </FormField>
          <FormField
            id="flat-price"
            label="Price per sqft"
            errorId="flat-price-error"
            errorMessage={errors.pricePerSqft?.message}
          >
            <Input
              id="flat-price"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.pricePerSqft)}
              aria-describedby={errors.pricePerSqft ? 'flat-price-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('pricePerSqft')}
            />
          </FormField>
          <FormField
            id="flat-status"
            label="Availability"
            errorId="flat-status-error"
            errorMessage={errors.status?.message}
          >
            <NativeSelect
              id="flat-status"
              className="w-full"
              selectClassName={FIELD_CLASS_NAME}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? 'flat-status-error' : undefined}
              {...register('status')}
            >
              {FLAT_STATUS_OPTIONS.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <FormField
            id="flat-construction"
            label="Construction status"
            errorId="flat-construction-error"
            errorMessage={errors.constructionStatus?.message}
          >
            <NativeSelect
              id="flat-construction"
              className="w-full"
              selectClassName={FIELD_CLASS_NAME}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.constructionStatus)}
              aria-describedby={errors.constructionStatus ? 'flat-construction-error' : undefined}
              {...register('constructionStatus')}
            >
              {FLAT_CONSTRUCTION_OPTIONS.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <FormField
            id="flat-handover"
            label="Handover date"
            errorId="flat-handover-error"
            errorMessage={errors.handoverDate?.message}
          >
            <Input
              id="flat-handover"
              autoComplete="off"
              placeholder="December 2027…"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.handoverDate)}
              aria-describedby={errors.handoverDate ? 'flat-handover-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('handoverDate')}
            />
          </FormField>
          <FormField
            id="flat-installment"
            label="Installment facility"
            errorId="flat-installment-error"
            errorMessage={errors.installmentFacility?.message}
          >
            <Input
              id="flat-installment"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.installmentFacility)}
              aria-describedby={errors.installmentFacility ? 'flat-installment-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('installmentFacility')}
            />
          </FormField>
          <FormField
            id="flat-facilities"
            label="Facilities"
            errorId="flat-facilities-error"
            errorMessage={errors.facilities?.message}
          >
            <Textarea
              id="flat-facilities"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.facilities)}
              aria-describedby={
                errors.facilities
                  ? 'flat-facilities-error flat-facilities-hint'
                  : 'flat-facilities-hint'
              }
              className={FIELD_CLASS_NAME}
              value={facilities.join('\n')}
              onChange={handleFacilitiesChange}
            />
            <p id="flat-facilities-hint" className="text-base text-muted-foreground">
              One facility per line.
            </p>
          </FormField>
          <FormField
            id="flat-offer"
            label="Special offer"
            errorId="flat-offer-error"
            errorMessage={errors.specialOffer?.message}
          >
            <Input
              id="flat-offer"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.specialOffer)}
              aria-describedby={errors.specialOffer ? 'flat-offer-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('specialOffer')}
            />
          </FormField>
          <FormField
            id="flat-drive"
            label="Drive link"
            errorId="flat-drive-error"
            errorMessage={errors.driveLink?.message}
          >
            <Input
              id="flat-drive"
              type="url"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.driveLink)}
              aria-describedby={errors.driveLink ? 'flat-drive-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('driveLink')}
            />
          </FormField>
          <FormField
            id="flat-youtube"
            label="YouTube link"
            errorId="flat-youtube-error"
            errorMessage={errors.youtubeVideoUrl?.message}
          >
            <Input
              id="flat-youtube"
              type="url"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.youtubeVideoUrl)}
              aria-describedby={errors.youtubeVideoUrl ? 'flat-youtube-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('youtubeVideoUrl')}
            />
          </FormField>
          <FormField
            id="flat-description"
            label="Description"
            errorId="flat-description-error"
            errorMessage={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  id="flat-description"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? 'flat-description-error' : undefined}
                />
              )}
            />
          </FormField>
        </section>

        <ProjectImageField
          images={images}
          disabled={isSubmitting}
          errorMessage={readImageError(errors.images)}
          onImagesChange={handleImagesChange}
          uploaderRef={uploaderRef}
        />

        <fieldset className="flex flex-col gap-3">
          <legend className="text-base font-medium text-foreground">Visibility</legend>
          <label className="flex min-h-11 items-center gap-3 text-base">
            <input
              type="checkbox"
              className="size-4"
              disabled={isSubmitting}
              {...register('published')}
            />
            Published
          </label>
          <label className="flex min-h-11 items-center gap-3 text-base">
            <input
              type="checkbox"
              className="size-4"
              disabled={isSubmitting}
              {...register('isFeatured')}
            />
            Featured
          </label>
          <p className="text-sm text-muted-foreground">
            Only one project (plot or flat) can be featured at a time.
          </p>
        </fieldset>

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save flat'}
        </Button>
      </form>
      <SaveSuccessDialog message={successMessage} onClose={handleSuccessClose} />
    </>
  );
}

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
import { createPlot, updatePlot } from '@/features/land-projects/actions';
import {
  PLOT_FORM_DEFAULTS,
  PLOT_STATUS_OPTIONS,
  plotFormSchema,
  type TPlotFieldErrors,
  type TPlotFormValues,
} from '@/features/land-projects/components/plot-form-schema';

const FIELD_CLASS_NAME = 'min-h-11 w-full text-base md:text-base';

type TPlotFormProps =
  | { mode: 'create'; defaultValues?: TPlotFormValues }
  | { mode: 'edit'; plotId: string; defaultValues: TPlotFormValues };

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

export function PlotForm(props: Readonly<TPlotFormProps>) {
  const defaultValues = props.defaultValues ?? PLOT_FORM_DEFAULTS;
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
  } = useForm<TPlotFormValues>({
    resolver: zodResolver(plotFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const images = useWatch({ control, name: 'images' });
  const facilities = useWatch({ control, name: 'facilities' });

  function applyFieldErrors(fieldErrors: TPlotFieldErrors) {
    for (const field of Object.keys(fieldErrors) as (keyof TPlotFieldErrors)[]) {
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

  async function handleValidSubmit(values: TPlotFormValues) {
    setFormError(null);
    const images = await uploaderRef.current?.waitForUploads();

    if (!images) {
      setFormError('The image could not be uploaded. Choose it again, then save.');
      return;
    }

    const nextValues = { ...values, images: [...images] };
    const result =
      props.mode === 'create'
        ? await createPlot(nextValues)
        : await updatePlot(props.plotId, nextValues);

    if (!result.ok && 'fieldErrors' in result) {
      applyFieldErrors(result.fieldErrors);
      return;
    }

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    if (props.mode === 'create') {
      reset(PLOT_FORM_DEFAULTS);
      setFormKey((currentKey) => currentKey + 1);
      setSuccessMessage('Plot created.');
      return;
    }

    setSuccessMessage('Plot updated.');
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
            id="plot-name"
            label="Name"
            errorId="plot-name-error"
            errorMessage={errors.name?.message}
          >
            <Input
              id="plot-name"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'plot-name-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('name')}
            />
          </FormField>
          <FormField
            id="plot-title"
            label="Title"
            errorId="plot-title-error"
            errorMessage={errors.title?.message}
          >
            <Input
              id="plot-title"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'plot-title-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('title')}
            />
          </FormField>
          <FormField
            id="plot-intro"
            label="Short intro"
            errorId="plot-intro-error"
            errorMessage={errors.shortIntro?.message}
          >
            <Input
              id="plot-intro"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.shortIntro)}
              aria-describedby={errors.shortIntro ? 'plot-intro-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('shortIntro')}
            />
          </FormField>
          <FormField
            id="plot-slug"
            label="Slug"
            errorId="plot-slug-error"
            errorMessage={errors.slug?.message}
          >
            <Input
              id="plot-slug"
              autoComplete="off"
              spellCheck={false}
              placeholder="green-city-plot…"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? 'plot-slug-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('slug')}
            />
          </FormField>
        </section>

        <section className="flex flex-col gap-4">
          <h2>Location</h2>
          <FormField
            id="plot-address"
            label="Address"
            errorId="plot-address-error"
            errorMessage={errors.address?.message}
          >
            <Input
              id="plot-address"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? 'plot-address-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('address')}
            />
          </FormField>
          <FormField
            id="plot-district"
            label="District"
            errorId="plot-district-error"
            errorMessage={errors.district?.message}
          >
            <Input
              id="plot-district"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.district)}
              aria-describedby={errors.district ? 'plot-district-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('district')}
            />
          </FormField>
          <FormField
            id="plot-landmark"
            label="Landmark"
            errorId="plot-landmark-error"
            errorMessage={errors.landmark?.message}
          >
            <Input
              id="plot-landmark"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.landmark)}
              aria-describedby={errors.landmark ? 'plot-landmark-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('landmark')}
            />
          </FormField>
          <FormField
            id="plot-map"
            label="Map URL"
            errorId="plot-map-error"
            errorMessage={errors.mapEmbedLink?.message}
          >
            <Input
              id="plot-map"
              type="url"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.mapEmbedLink)}
              aria-describedby={errors.mapEmbedLink ? 'plot-map-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('mapEmbedLink')}
            />
          </FormField>
        </section>

        <section className="flex flex-col gap-4">
          <h2>Details</h2>
          <FormField
            id="plot-price"
            label="Shotangsho price"
            errorId="plot-price-error"
            errorMessage={errors.shotangshoPrice?.message}
          >
            <Input
              id="plot-price"
              autoComplete="off"
              placeholder="11 lk to 25 lk…"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.shotangshoPrice)}
              aria-describedby={errors.shotangshoPrice ? 'plot-price-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('shotangshoPrice')}
            />
          </FormField>
          <FormField
            id="plot-area"
            label="Land area"
            errorId="plot-area-error"
            errorMessage={errors.landAreaSize?.message}
          >
            <Input
              id="plot-area"
              autoComplete="off"
              placeholder="50+ Ekor…"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.landAreaSize)}
              aria-describedby={errors.landAreaSize ? 'plot-area-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('landAreaSize')}
            />
          </FormField>
          <FormField
            id="plot-status"
            label="Status"
            errorId="plot-status-error"
            errorMessage={errors.status?.message}
          >
            <NativeSelect
              id="plot-status"
              className="w-full"
              selectClassName={FIELD_CLASS_NAME}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? 'plot-status-error' : undefined}
              {...register('status')}
            >
              {PLOT_STATUS_OPTIONS.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <FormField
            id="plot-installment"
            label="Installment facility"
            errorId="plot-installment-error"
            errorMessage={errors.installmentFacility?.message}
          >
            <Input
              id="plot-installment"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.installmentFacility)}
              aria-describedby={errors.installmentFacility ? 'plot-installment-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('installmentFacility')}
            />
          </FormField>
          <FormField
            id="plot-facilities"
            label="Facilities"
            errorId="plot-facilities-error"
            errorMessage={errors.facilities?.message}
          >
            <Textarea
              id="plot-facilities"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.facilities)}
              aria-describedby={
                errors.facilities
                  ? 'plot-facilities-error plot-facilities-hint'
                  : 'plot-facilities-hint'
              }
              className={FIELD_CLASS_NAME}
              value={facilities.join('\n')}
              onChange={handleFacilitiesChange}
            />
            <p id="plot-facilities-hint" className="text-base text-muted-foreground">
              One facility per line.
            </p>
          </FormField>
          <FormField
            id="plot-offer"
            label="Special offer"
            errorId="plot-offer-error"
            errorMessage={errors.specialOffer?.message}
          >
            <Input
              id="plot-offer"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.specialOffer)}
              aria-describedby={errors.specialOffer ? 'plot-offer-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('specialOffer')}
            />
          </FormField>
          <FormField
            id="plot-drive"
            label="Drive link"
            errorId="plot-drive-error"
            errorMessage={errors.driveLink?.message}
          >
            <Input
              id="plot-drive"
              type="url"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.driveLink)}
              aria-describedby={errors.driveLink ? 'plot-drive-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('driveLink')}
            />
          </FormField>
          <FormField
            id="plot-youtube"
            label="YouTube link"
            errorId="plot-youtube-error"
            errorMessage={errors.youtubeVideoUrl?.message}
          >
            <Input
              id="plot-youtube"
              type="url"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.youtubeVideoUrl)}
              aria-describedby={errors.youtubeVideoUrl ? 'plot-youtube-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('youtubeVideoUrl')}
            />
          </FormField>
          <FormField
            id="plot-description"
            label="Description"
            errorId="plot-description-error"
            errorMessage={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  id="plot-description"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? 'plot-description-error' : undefined}
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
          {isSubmitting ? 'Saving…' : 'Save plot'}
        </Button>
      </form>
      <SaveSuccessDialog message={successMessage} onClose={handleSuccessClose} />
    </>
  );
}

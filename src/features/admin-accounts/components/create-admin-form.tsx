'use client';

import { useState, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createAdmin } from '@/features/admin-accounts/actions/create-admin';
import {
  CREATE_ADMIN_DEFAULT_VALUES,
  createAdminSchema,
  type TCreateAdminValues,
} from '@/features/admin-accounts/components/admin-account-schema';

const FIELD_CLASS_NAME = 'min-h-11 text-base md:text-base';

export function CreateAdminForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TCreateAdminValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: CREATE_ADMIN_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  async function handleValidSubmit(values: TCreateAdminValues) {
    setFormError(null);
    setSuccessMessage(null);

    const result = await createAdmin(values);

    if (!result.ok && 'fieldErrors' in result) {
      if (result.fieldErrors.name) {
        setError('name', { message: result.fieldErrors.name });
      }

      if (result.fieldErrors.email) {
        setError('email', { message: result.fieldErrors.email });
      }

      if (result.fieldErrors.password) {
        setError('password', { message: result.fieldErrors.password });
      }

      return;
    }

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    reset(CREATE_ADMIN_DEFAULT_VALUES);
    setFormKey((currentKey) => currentKey + 1);
    setSuccessMessage('Admin account created.');
  }

  const handleFormSubmit = handleSubmit(handleValidSubmit);

  return (
    <Card>
      <CardHeader>
        <h2>Create admin</h2>
        <CardDescription>
          New accounts are admins. They cannot manage other accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} className="flex flex-col gap-4" noValidate onSubmit={handleFormSubmit}>
          {formError ? (
            <p role="alert" className="text-base text-destructive">
              {formError}
            </p>
          ) : null}
          {successMessage ? (
            <p role="status" className="text-base text-foreground">
              {successMessage}
            </p>
          ) : null}

          <AccountField
            id="create-admin-name"
            label="Name"
            errorId="create-admin-name-error"
            errorMessage={errors.name?.message}
          >
            <Input
              id="create-admin-name"
              type="text"
              autoComplete="name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'create-admin-name-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('name')}
            />
          </AccountField>

          <AccountField
            id="create-admin-email"
            label="Email"
            errorId="create-admin-email-error"
            errorMessage={errors.email?.message}
          >
            <Input
              id="create-admin-email"
              type="email"
              autoComplete="off"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'create-admin-email-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('email')}
            />
          </AccountField>

          <AccountField
            id="create-admin-password"
            label="Password"
            errorId="create-admin-password-error"
            errorMessage={errors.password?.message}
          >
            <Input
              id="create-admin-password"
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'create-admin-password-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('password')}
            />
          </AccountField>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create admin'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type TAccountFieldProps = {
  id: string;
  label: string;
  errorId: string;
  errorMessage?: string;
  children: ReactNode;
};

function AccountField({
  id,
  label,
  errorId,
  errorMessage,
  children,
}: Readonly<TAccountFieldProps>) {
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

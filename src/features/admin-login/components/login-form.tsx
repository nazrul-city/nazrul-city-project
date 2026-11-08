'use client';

import { useState, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { login } from '@/features/admin-login/actions/login';
import {
  LOGIN_FORM_DEFAULT_VALUES,
  loginFormSchema,
  type TLoginFormValues,
} from '@/features/admin-login/components/login-form-schema';

const FIELD_CLASS_NAME = 'min-h-11 text-base md:text-base';

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  async function handleValidSubmit(values: TLoginFormValues) {
    setFormError(null);

    const result = await login(values);

    if ('fieldErrors' in result) {
      if (result.fieldErrors.email) {
        setError('email', { message: result.fieldErrors.email });
      }

      if (result.fieldErrors.password) {
        setError('password', { message: result.fieldErrors.password });
      }

      return;
    }

    setFormError(result.message);
  }

  const handleFormSubmit = handleSubmit(handleValidSubmit);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1>Sign in</h1>
        <CardDescription>Nazrul City admin</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" noValidate onSubmit={handleFormSubmit}>
          {formError ? (
            <p role="alert" className="text-base text-destructive">
              {formError}
            </p>
          ) : null}

          <LoginField
            id="admin-email"
            label="Email"
            errorId="admin-email-error"
            errorMessage={errors.email?.message}
          >
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'admin-email-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('email')}
            />
          </LoginField>

          <LoginField
            id="admin-password"
            label="Password"
            errorId="admin-password-error"
            errorMessage={errors.password?.message}
          >
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'admin-password-error' : undefined}
              className={FIELD_CLASS_NAME}
              {...register('password')}
            />
          </LoginField>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type TLoginFieldProps = {
  id: string;
  label: string;
  errorId: string;
  errorMessage?: string;
  children: ReactNode;
};

function LoginField({ id, label, errorId, errorMessage, children }: Readonly<TLoginFieldProps>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
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

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/features/admin-login';
import { readActiveAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await readActiveAdmin();

  if (admin) {
    redirect('/admin');
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <LoginForm />
    </main>
  );
}

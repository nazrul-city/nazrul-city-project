import type { Metadata } from 'next';
import { Footer, Navbar } from '@/components/layout';
import { NotFoundView } from '@/components/shared/not-found-view';

export const metadata: Metadata = {
  title: 'পৃষ্ঠাটি পাওয়া যায়নি',
  description:
    'আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি। নজরুল সিটির হোম বা প্রকল্প তালিকায় ফিরে যান।',
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <NotFoundView />
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GALLERY_CATEGORIES } from '../constants/gallery';
import type { TCategoryFilter } from '../types/gallery-photo';

type TGalleryCategorySelectProps = {
  currentCategory: TCategoryFilter;
  basePath?: string;
};

export function GalleryCategorySelect({
  currentCategory,
  basePath = '/media/gallery',
}: Readonly<TGalleryCategorySelectProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleValueChange(value: unknown) {
    if (typeof value !== 'string') {
      return;
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'ALL') {
        params.delete('category');
      } else {
        params.set('category', value);
      }
      params.delete('page'); // Reset to page 1 on category change

      const query = params.toString();
      router.push(query ? `${basePath}?${query}` : basePath);
    });
  }

  return (
    <div className="w-full sm:w-72">
      <Select
        items={GALLERY_CATEGORIES}
        value={currentCategory}
        onValueChange={handleValueChange}
        disabled={isPending}
      >
        <SelectTrigger aria-label="ক্যাটাগরি নির্বাচন করুন">
          <div className="flex items-center gap-2 truncate overflow-hidden">
            <SlidersHorizontal className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="shrink-0 text-xs font-medium text-muted-foreground">ক্যাটাগরি:</span>
            <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন">
              {(value) => (
                <span className="font-semibold text-foreground">
                  {GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? String(value ?? '')}
                </span>
              )}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {GALLERY_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

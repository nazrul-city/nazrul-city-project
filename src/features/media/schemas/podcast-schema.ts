import { z } from 'zod';
import { readYoutubeVideoId } from '@/utils/project-listing-fields';

export const PODCAST_DURATION_REGEX = /^(\d{1,2}:)?\d{1,2}:\d{2}$/;

export const podcastFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'পডকাস্টের শিরোনাম লিখুন।')
    .max(200, 'শিরোনাম সর্বোচ্চ ২০০ অক্ষরের হতে পারে।'),
  youtubeUrl: z
    .string()
    .trim()
    .min(1, 'ইউটিউব ভিডিও লিংক দিন।')
    .refine((url) => readYoutubeVideoId(url) !== null, {
      message: 'সঠিক ইউটিউব ভিডিও লিংক দিন (যেমন: https://www.youtube.com/watch?v=...)।',
    }),
  duration: z
    .string()
    .trim()
    .min(1, 'ভিডিও সময়কাল দিন।')
    .regex(PODCAST_DURATION_REGEX, 'সময় min:sec ফরম্যাটে দিন (যেমন: 12:45 বা 1:15:30)।'),
  published: z.boolean(),
  clientName: z.string().trim().max(120, 'সর্বোচ্চ ১২০ অক্ষর হতে পারে।').optional(),
  clientDesignation: z.string().trim().max(120, 'সর্বোচ্চ ১২০ অক্ষর হতে পারে।').optional(),
  projectName: z.string().trim().max(120, 'সর্বোচ্চ ১২০ অক্ষর হতে পারে।').optional(),
});

export const addPodcastSchema = podcastFormSchema.extend({
  thumbnailUrl: z.string().trim().url('সঠিক থাম্বনেইল URL দিন।'),
});

export const updatePodcastSchema = addPodcastSchema.extend({
  id: z.string().uuid('সঠিক আইডি নয়।'),
});

export type TPodcastFormValues = {
  title: string;
  youtubeUrl: string;
  duration: string;
  published: boolean;
  clientName?: string;
  clientDesignation?: string;
  projectName?: string;
};

export type TAddPodcastValues = z.infer<typeof addPodcastSchema>;
export type TUpdatePodcastValues = z.infer<typeof updatePodcastSchema>;

export type TPodcastActionResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<keyof TAddPodcastValues, string>>;
    };

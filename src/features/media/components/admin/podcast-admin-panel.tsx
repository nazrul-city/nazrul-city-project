'use client';

import { useState } from 'react';
import { reorderPodcastsAction } from '@/features/media/actions';
import { MAX_PUBLISHED_PODCASTS } from '@/features/media/constants/podcasts';
import type { TPodcast } from '@/features/media/types/podcast';
import { CreatePodcastForm } from './create-podcast-form';
import { EditPodcastDialog } from './edit-podcast-dialog';
import { PodcastAdminList } from './podcast-admin-list';

type TPodcastAdminPanelProps = {
  podcasts: readonly TPodcast[];
};

export function PodcastAdminPanel({
  podcasts: initialPodcasts,
}: Readonly<TPodcastAdminPanelProps>) {
  const [podcasts, setPodcasts] = useState<TPodcast[]>([...initialPodcasts]);
  const [editingPodcast, setEditingPodcast] = useState<TPodcast | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const publishedCount = podcasts.filter((p) => p.published).length;

  function handlePodcastAdded(newPodcast: TPodcast) {
    setPodcasts((prev) => [...prev, newPodcast]);
  }

  function handlePodcastDeleted(id: string) {
    setPodcasts((prev) => prev.filter((p) => p.id !== id));
  }

  function handlePodcastUpdated(updated: TPodcast) {
    setPodcasts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleVisibilityToggle(id: string, published: boolean) {
    setPodcasts((prev) => prev.map((p) => (p.id === id ? { ...p, published } : p)));
  }

  async function handleMovePodcast(fromIndex: number, toIndex: number) {
    const next = [...podcasts];
    const itemA = next[fromIndex];
    const itemB = next[toIndex];

    if (!itemA || !itemB) {
      return;
    }

    next[fromIndex] = itemB;
    next[toIndex] = itemA;
    setPodcasts(next);
    setReorderError(null);

    const result = await reorderPodcastsAction(next.map((p) => p.id));
    if (!result.ok) {
      setReorderError(result.message);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            পডকাস্ট ও সাক্ষাৎকার ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            মিডিয়া পেজে প্রদর্শনের জন্য ক্লায়েন্ট পডকাস্ট ও সাক্ষাৎকার ভিডিও সাজান ও নিয়ন্ত্রণ
            করুন।
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs">
            মোট: {podcasts.length}টি
          </span>
          <span
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs ${
              publishedCount >= MAX_PUBLISHED_PODCASTS
                ? 'border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200'
                : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            প্রকাশিত: {publishedCount}/{MAX_PUBLISHED_PODCASTS}টি
          </span>
        </div>
      </div>

      {/* Create Form */}
      <CreatePodcastForm publishedCount={publishedCount} onPodcastAdded={handlePodcastAdded} />

      {reorderError ? (
        <p role="alert" className="text-sm text-destructive">
          {reorderError}
        </p>
      ) : null}

      {/* Existing List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            তালিকাভুক্ত ভিডিওসমূহ ({podcasts.length}টি)
          </h2>
          <span className="text-xs text-muted-foreground">
            তীর চিহ্ন ব্যবহার করে ক্রম পরিবর্তন করুন
          </span>
        </div>

        <PodcastAdminList
          podcasts={podcasts}
          publishedCount={publishedCount}
          onMove={handleMovePodcast}
          onDelete={handlePodcastDeleted}
          onEdit={(podcast) => setEditingPodcast(podcast)}
          onVisibilityToggle={handleVisibilityToggle}
        />
      </div>

      {/* Edit Dialog */}
      {editingPodcast ? (
        <EditPodcastDialog
          key={editingPodcast.id}
          podcast={editingPodcast}
          publishedCount={publishedCount}
          onClose={() => setEditingPodcast(null)}
          onPodcastUpdated={handlePodcastUpdated}
        />
      ) : null}
    </div>
  );
}

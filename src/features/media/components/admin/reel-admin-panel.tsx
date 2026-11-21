'use client';

import { useState } from 'react';
import { reorderFacebookReelsAction } from '@/features/media/actions';
import { MAX_FACEBOOK_REELS } from '@/features/media/constants';
import type { TFacebookReel } from '@/features/media/types/facebook-reel';
import { CreateReelForm } from './create-reel-form';
import { EditReelDialog } from './edit-reel-dialog';
import { ReelAdminList } from './reel-admin-list';

type TReelAdminPanelProps = {
  reels: readonly TFacebookReel[];
};

export function ReelAdminPanel({ reels: initialReels }: Readonly<TReelAdminPanelProps>) {
  const [reels, setReels] = useState<TFacebookReel[]>([...initialReels]);
  const [editingReel, setEditingReel] = useState<TFacebookReel | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);

  function handleReelAdded(newReel: TFacebookReel) {
    setReels((prev) => [...prev, newReel]);
  }

  function handleReelDeleted(id: string) {
    setReels((prev) => prev.filter((r) => r.id !== id));
  }

  function handleReelUpdated(updated: TFacebookReel) {
    setReels((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  async function handleMoveReel(fromIndex: number, toIndex: number) {
    const next = [...reels];
    const itemA = next[fromIndex];
    const itemB = next[toIndex];

    if (!itemA || !itemB) {
      return;
    }

    next[fromIndex] = itemB;
    next[toIndex] = itemA;
    setReels(next);
    setReorderError(null);

    const result = await reorderFacebookReelsAction(next.map((r) => r.id));
    if (!result.ok) {
      setReorderError(result.message);
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          ফেসবুক রিলস ব্যবস্থাপনা
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          মিডিয়া পেজের &apos;Top 5 Facebook Reels&apos; সেকশনের জন্য সর্বোচ্চ {MAX_FACEBOOK_REELS}
          টি রিলস সংরক্ষণ ও সাজান।
        </p>
      </div>

      <CreateReelForm currentCount={reels.length} onReelAdded={handleReelAdded} />

      {reorderError ? (
        <p role="alert" className="text-sm text-destructive">
          {reorderError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            বর্তমান রিলস ({reels.length}/{MAX_FACEBOOK_REELS})
          </h2>
          <span className="text-xs text-muted-foreground">
            তীর চিহ্ন ব্যবহার করে ক্রমানুসার পরিবর্তন করুন
          </span>
        </div>

        <ReelAdminList
          reels={reels}
          onMove={handleMoveReel}
          onDelete={handleReelDeleted}
          onEdit={(reel) => {
            setEditingReel(reel);
          }}
        />
      </div>

      {editingReel ? (
        <EditReelDialog
          key={editingReel.id}
          reel={editingReel}
          onClose={() => {
            setEditingReel(null);
          }}
          onReelUpdated={handleReelUpdated}
        />
      ) : null}
    </div>
  );
}

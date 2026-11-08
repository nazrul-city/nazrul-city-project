'use client';

import { Tabs } from '@base-ui/react/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import type { TFaqGroup, TFaqItem } from '@/features/landing-page/constants/faqs';
import { cn } from '@/lib/utils';

function getCategoryTabClassName(state: { active: boolean }) {
  return cn(
    buttonVariants({
      variant: state.active ? 'secondary' : 'outline',
      size: 'default',
    }),
    'w-full'
  );
}

type TFaqTabsProps = {
  groups: readonly TFaqGroup[];
};

export function FaqTabs({ groups }: Readonly<TFaqTabsProps>) {
  const firstGroup = groups[0];

  if (!firstGroup) {
    return null;
  }

  return (
    <Tabs.Root defaultValue={firstGroup.id} className="mt-8 md:mt-10">
      <Tabs.List className="grid grid-cols-2 gap-2" aria-label="Question type">
        {groups.map((group) => (
          <Tabs.Tab key={group.id} value={group.id} className={getCategoryTabClassName}>
            {group.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {groups.map((group) => (
        <Tabs.Panel key={group.id} value={group.id} className="mt-6">
          <FaqAccordion category={group.id} items={group.items} />
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

type TFaqAccordionProps = {
  category: string;
  items: readonly TFaqItem[];
};

function FaqAccordion({ category, items }: Readonly<TFaqAccordionProps>) {
  const firstItem = items[0];

  if (!firstItem) {
    return null;
  }

  return (
    <Accordion
      key={category}
      defaultValue={[firstItem.id]}
      hiddenUntilFound
      multiple={false}
      className="border-t border-border"
    >
      {items.map((item) => (
        <FaqItem key={item.id} item={item} />
      ))}
    </Accordion>
  );
}

type TFaqItemProps = {
  item: TFaqItem;
};

function FaqItem({ item }: Readonly<TFaqItemProps>) {
  return (
    <AccordionItem value={item.id}>
      <AccordionTrigger className="min-h-11 px-4 py-3 text-base font-semibold hover:bg-muted hover:no-underline">
        <span className="min-w-0">{item.question}</span>
      </AccordionTrigger>
      <AccordionContent>
        <p className="rounded-xl px-4 py-0 text-base leading-relaxed text-muted-foreground">
          {item.answer}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

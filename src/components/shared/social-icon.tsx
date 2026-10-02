import { cn } from '@/lib/utils';

export type TSocialIcon = 'facebook' | 'instagram' | 'youtube' | 'whatsapp';

type TSocialIconProps = {
  name: TSocialIcon;
};

const SOCIAL_ICON_CLASS =
  'inline-block size-6 shrink-0 bg-current mask-contain mask-center mask-no-repeat';

const SOCIAL_ICON_MASK = {
  facebook: '[mask-image:url(/svg-icon/facebook.svg)]',
  instagram: '[mask-image:url(/svg-icon/instagram.svg)]',
  youtube: '[mask-image:url(/svg-icon/youtube.svg)]',
  whatsapp: '[mask-image:url(/svg-icon/whatsapp.svg)]',
} as const satisfies Record<TSocialIcon, string>;

export function SocialIcon({ name }: Readonly<TSocialIconProps>) {
  return <span aria-hidden="true" className={cn(SOCIAL_ICON_CLASS, SOCIAL_ICON_MASK[name])} />;
}

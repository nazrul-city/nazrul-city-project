import Image from 'next/image';
import type { TPartner } from '@/features/landing-page/constants/partners';

export type TPartnerLogoProps = {
  partner: TPartner;
};

export function PartnerLogo({ partner }: Readonly<TPartnerLogoProps>) {
  const isSvg = partner.src.endsWith('.svg');

  return (
    <Image
      src={partner.src}
      alt={partner.name}
      width={partner.width}
      height={partner.height}
      unoptimized={isSvg}
      sizes="(min-width: 768px) 10rem, 8rem"
      className="h-12 w-auto shrink-0 object-contain opacity-80 transition-opacity duration-200 hover:opacity-100 md:h-14"
    />
  );
}

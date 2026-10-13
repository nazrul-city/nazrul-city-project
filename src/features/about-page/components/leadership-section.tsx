import Image from 'next/image';
import { SectionLayout } from '@/components/layout';

const LEADERS = [
  {
    id: 'md-nazrul-islam',
    name: 'Md. Nazrul Islam',
    role: 'Chairman',
    image: '/images/about-page/our-leadership/md-nazrul-islam.png',
  },
  {
    id: 'suraiya-begum',
    name: 'Suraiya Begum',
    role: '-------',
    image: '/images/about-page/our-leadership/suraiya-begum.png',
  },
  {
    id: 'ishraq-nazrul',
    name: 'Ishraq Md. Nazrul',
    role: 'Director & CTO',
    image: '/images/about-page/our-leadership/ishraq-nazrul.png',
  },
  {
    id: 'sadia-islam-sneha',
    name: 'Sadia Islam Sneha',
    role: 'Director',
    image: '/images/about-page/our-leadership/sadia-islam-sneha.png',
  },
] as const;

export function LeadershipSection() {
  return (
    <SectionLayout aria-labelledby="leadership-heading">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 id="leadership-heading">আমাদের নেতৃত্ব</h2>
      </div>

      <ul className="mt-8 grid list-none grid-cols-2 gap-6 md:mt-10 lg:grid-cols-4 lg:gap-8">
        {LEADERS.map((leader) => (
          <li key={leader.id}>
            <LeaderCard image={leader.image} name={leader.name} role={leader.role} />
          </li>
        ))}
      </ul>
    </SectionLayout>
  );
}

type TLeaderCardProps = {
  name: string;
  role: string;
  image: string;
};

function LeaderCard({ name, role, image }: Readonly<TLeaderCardProps>) {
  return (
    <article className="flex flex-col items-center">
      <div className="relative aspect-3/4 w-full bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 16rem, 50vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 -mt-8 w-[90%] bg-muted px-1 py-3 text-center shadow-sm">
        <h6 className="text-sm text-balance md:text-base">{name}</h6>
        <p className="mt-1 text-xs text-muted-foreground md:text-sm">{role}</p>
      </div>
    </article>
  );
}

export type TPartner = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
};

export const PARTNERS = [
  {
    id: 'ukil-bari',
    name: 'Ukil Bari',
    src: '/images/landing-page/partners/ub.webp',
    width: 800,
    height: 325,
  },
  {
    id: 'silicon',
    name: 'Silicon',
    src: '/images/landing-page/partners/silicon.svg',
    width: 911,
    height: 605,
  },
  {
    id: 'somoy-sangbad',
    name: 'Somoy Sangbad',
    src: '/images/landing-page/partners/somoy_sangbad.svg',
    width: 844,
    height: 414,
  },
  {
    id: 'global-tower',
    name: 'Global Tower',
    src: '/images/landing-page/partners/global_tower.svg',
    width: 873,
    height: 661,
  },
  {
    id: 'nazrul-green-city',
    name: 'Nazrul Green City',
    src: '/images/landing-page/partners/nazrul_green_city.svg',
    width: 785,
    height: 682,
  },
] as const satisfies readonly TPartner[];

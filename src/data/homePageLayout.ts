export interface LayoutItem {
  title: string;
  description: string;
  route: string;
  image: string;
  size: string;
  sizeLg: string;
}

export const homePageLayout: LayoutItem[] = [
  {
    title: 'Map',
    description: '',
    route: '/map',
    image: '/images/map-small.webp',
    size: '6',
    sizeLg: '3',
  },
  {
    title: 'Trick Comp',
    description: '',
    route: '/trick-comp',
    image: '/images/trick-comp-small.webp',
    size: '6',
    sizeLg: '3',
  },
  {
    title: 'Scavenger Hunt',
    description:
      'Look for tiny purple, green, or gold squirrels to win prizes.',
    route: '/scavenger-hunt',
    image: '/images/scavenger-hunt-small.webp',
    size: '6',
    sizeLg: '3',
  },
  {
    title: 'Side Quests',
    description: '',
    route: '/quests',
    image: '/images/quests-small.webp',
    size: '6',
    sizeLg: '3',
  },

  // {
  //   title: 'Raffles',
  //   description: 'Win amazing prizes',
  //   route: '/raffles-giveaways',
  //   image: '/images/raffles-giveaways-small.webp',
  //   size: '6',
  //   sizeLg: '3'
  // },
  {
    title: 'Drip Schedule',
    description: 'Daily outfit schedule',
    route: '/drip-schedule',
    image: '/images/drip-schedule-small.webp',
    size: '6',
    sizeLg: '3',
  },
  {
    title: 'Sponsors',
    description: '',
    route: '/sponsors',
    image: '/images/sponsors-small.webp',
    size: '6',
    sizeLg: '3',
  },
];

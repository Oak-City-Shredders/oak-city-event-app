export interface LayoutItem {
  title: string;
  description: string;
  route: string;
  image: string;
}

export const homePageLayout: LayoutItem[] = [
  {
    title: 'View Schedule',
    description: '',
    route: '/schedule',
    image: '/images/schedule-small.webp',
  },
  {
    title: 'Map',
    description: '',
    route: '/map',
    image: '/images/map-small.webp',
  },
  {
    title: 'Race Info',
    description: 'Rules and races',
    route: '/race-information',
    image: '/images/race-information-small.webp',
  },
  {
    title: 'Trick Comp',
    description: '',
    route: '/trick-comp',
    image: '/images/trick-comp-small.webp',
  },
  {
    title: 'Scavenger Hunt',
    description:
      'Look for tiny purple, green, or gold squirrels to win prizes.',
    route: '/scavenger-hunt',
    image: '/images/scavenger-hunt-small.webp',
  },
  {
    title: 'Side Quests',
    description: '',
    route: '/quests',
    image: '/images/quests-small.webp',
  },
  {
    title: 'Food Trucks',
    description: 'Explore food truck options.',
    route: '/food-trucks',
    image: '/images/food-truck-small.webp',
  },
  // {
  //   title: 'Raffles',
  //   description: 'Win amazing prizes',
  //   route: '/raffles-giveaways',
  //   image: '/images/raffles-giveaways-small.webp',
  // },
  // {
  //   title: 'Get Help',
  //   description: 'Contact information',
  //   route: '/emergency-services',
  //   image: '/images/emergency-services-small.webp',
  // },
  {
    title: 'Drip Schedule',
    description: 'Daily outfit schedule',
    route: '/drip-schedule',
    image: '/images/drip-schedule-small.webp',
  },
];

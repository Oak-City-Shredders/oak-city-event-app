import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenu,
  IonMenuToggle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  useIonRouter,
  IonIcon,
} from '@ionic/react';

import {
  flag,
  ticket,
  trophy,
  search,
  compass,
  shirt,
  people,
  fastFood,
  help,
  information,
  discOutline,
  exit,
} from 'ionicons/icons';

import styles from './HomePageMenu.module.css';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { FireDBEventInfo } from '../context/CurrentEventContext';

const HomePageMenu: React.FC = () => {
  const router = useIonRouter();
  const {
    data: dataEventInfo,
    loading: loadingEventInfo,
    refetch: refetchEventInfo,
    error: errorEventInfo,
  } = useFireStoreDB<FireDBEventInfo>('EventInfo');

  const eventInfo = !dataEventInfo
    ? {}
    : Object.fromEntries(dataEventInfo.map(({ id, value }) => [id, value]));

  type MenuItem = { label: string; route: string; icon: string };
  const menuItems = [
    eventInfo.ticketsEnabled && {
      label: 'Tickets',
      route: '/tickets',
      icon: ticket,
    },
    eventInfo.racingEnabled && {
      label: 'Racing',
      route: '/race-information',
      icon: flag,
    },
    eventInfo.trickCompEnabled && {
      label: 'Trick Comp',
      route: '/trick-comp',
      icon: trophy,
    },
    eventInfo.scavengerHuntEnabled && {
      label: 'Scavenger Hunt',
      route: '/scavenger-hunt',
      icon: search,
    },
    eventInfo.sideQuestsEnabled && {
      label: 'Side Quests',
      route: '/quests',
      icon: compass,
    },
    eventInfo.dripScheduleEnabled && {
      label: 'Drip Schedule',
      route: '/drip-schedule',
      icon: shirt,
    },
    {
      label: 'Sponsors',
      route: '/sponsors',
      icon: people,
    },
    eventInfo.foodTrucksEnabled && {
      label: 'Food Trucks',
      route: '/food-trucks',
      icon: fastFood,
    },
    eventInfo.getHelpEnabled && {
      label: 'Get Help',
      route: '/emergency-services',
      icon: help,
    },
    eventInfo.discGolfEnabled && {
      label: 'Ferngully Disc Golf',
      route: '/ferngully-disc-golf',
      icon: discOutline,
    },
    eventInfo.aboutEnabled && {
      label: 'About',
      route: '/about',
      icon: information,
    },
    {
      label: 'View Other Events',
      route: '/',
      icon: exit,
    },
  ].filter(Boolean) as MenuItem[]; // Remove any `false` entries

  const handleMenuItemClick = (route: string) => {
    router.push(route, 'forward');
  };

  return (
    <IonMenu contentId="main-content" maxEdgeStart={0}>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Navigation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {menuItems.map((item, index) => (
            <IonMenuToggle key={index}>
              <IonItem
                button
                onClick={() => handleMenuItemClick(item.route)}
                className={styles.item}
              >
                <IonLabel>
                  <IonIcon icon={item.icon} className={styles.menuItemIcon} /> 
                  {item.label}
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default HomePageMenu;

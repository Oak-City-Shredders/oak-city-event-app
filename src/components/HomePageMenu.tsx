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
  calendar,
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
} from 'ionicons/icons';

import styles from './HomePageMenu.module.css';

const HomePageMenu: React.FC = () => {
  const router = useIonRouter();

  const menuItems = [
    {
      label: 'Tickets',
      route: '/tickets',
      icon: ticket,
    },
    {
      label: 'Racing',
      route: '/race-information',
      icon: flag,
    },
    {
      label: 'Trick Comp',
      route: '/trick-comp',
      icon: trophy,
    },
    {
      label: 'Scavenger Hunt',
      route: '/scavenger-hunt',
      icon: search,
    },
    {
      label: 'Side Quests',
      route: '/quests',
      icon: compass,
    },
    {
      label: 'Drip Schedule',
      route: '/drip-schedule',
      icon: shirt,
    },
    {
      label: 'Sponsors',
      route: '/sponsors',
      icon: people,
    },
    {
      label: 'Food Trucks',
      route: '/food-trucks',
      icon: fastFood,
    },
    {
      label: 'Get Help',
      route: '/emergency-services',
      icon: help,
    },
    {
      label: 'About',
      route: '/about',
      icon: information,
    },
  ];

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

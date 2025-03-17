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
} from '@ionic/react';
import { LayoutItem } from '../data/homePageLayout';

interface HomePageMenuProps {
  homePageLayout: LayoutItem[];
}

const HomePageMenu: React.FC<HomePageMenuProps> = ({ homePageLayout }) => {
  const router = useIonRouter();
  const handleMenuItemClick = (route: string) => {
    router.push(route, 'forward'); // "forward" for a page transition effect
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
          <IonMenuToggle key={homePageLayout.length + 2}>
            <IonItem
              button
              onClick={() => {
                handleMenuItemClick('/schedule');
              }}
            >
              <IonLabel>Schedule</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle key={homePageLayout.length + 1}>
            <IonItem
              button
              onClick={() => {
                handleMenuItemClick('/race-information');
              }}
            >
              <IonLabel>Racing</IonLabel>
            </IonItem>
          </IonMenuToggle>
          {homePageLayout.map((item, index) => (
            <IonMenuToggle key={index}>
              <IonItem
                button
                key={item.route}
                onClick={() => {
                  handleMenuItemClick(item.route);
                }}
              >
                <IonLabel>{item.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
        <IonList>
          <IonMenuToggle key={homePageLayout.length + 5}>
            <IonItem
              button
              onClick={() => {
                handleMenuItemClick('/food-trucks');
              }}
            >
              <IonLabel>Food Trucks</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle key={homePageLayout.length + 3}>
            <IonItem
              button
              onClick={() => {
                handleMenuItemClick('/emergency-services');
              }}
            >
              <IonLabel>Get Help</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle key={homePageLayout.length + 4}>
            <IonItem
              button
              onClick={() => {
                handleMenuItemClick('/about');
              }}
            >
              <IonLabel>About</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default HomePageMenu;

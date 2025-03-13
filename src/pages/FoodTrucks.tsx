import React, { useMemo } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import useFireStoreDB from '../hooks/useFireStoreDB';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonRefresher,
  IonChip,
  IonRefresherContent,
  IonCardTitle,
  IonImg,
  IonCardSubtitle,
  RefresherEventDetail,
} from '@ionic/react';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

interface FireDBFoodTruck {
  Image: string;
  IsOpenForOrders: string;
  Location: string;
  Menu: string;
  Name: string;
  Notes: string;
  PlannedSchedule: any | string;
  link: string;
  description: string;
  Category: string;
  id: string;
}

const FoodTrucks: React.FC = () => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBFoodTruck>('FoodTrucks');

  const layout = useMemo(() => {
    if (!data) return [];

    const mappedData = data.map((truck) => ({
      image: truck.Image,
      route: truck.link,
      description: truck.description,
      title: truck.Name,
      isOpenForOrders: Boolean(truck.IsOpenForOrders === 'Yes'),
      plannedSchedule: truck.PlannedSchedule
        ? JSON.parse(truck.PlannedSchedule)
        : {},
      menu: truck.Menu,
      category: truck.Category,
    }));

    return mappedData;
  }, [data]);

  const handleCardClick = (route: string): void => {
    window.open(route, '_blank');
  };

  const handleRefresh = useRefreshHandler(refetch);

  return (
    <IonPage>
      <PageHeader title="Food Trucks" />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <p>Loading food trucks...</p>
        ) : error ? (
          <p>Error loading food trucks</p>
        ) : (
          <>
            {layout.map((item, index: number) => (
              <IonCard key={index} onClick={() => handleCardClick(item.route)}>
                <IonImg src={item.image} alt={item.title} />
                <IonCardHeader>
                  <IonCardTitle>{item.title}</IonCardTitle>
                  {item.isOpenForOrders && (
                    <IonCardSubtitle>
                      <IonChip color="success">Taking Orders Now</IonChip>{' '}
                    </IonCardSubtitle>
                  )}
                </IonCardHeader>
                <IonCardContent>
                  <p>{item.description}</p>
                  <br></br>
                  <p>{item.menu}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FoodTrucks;

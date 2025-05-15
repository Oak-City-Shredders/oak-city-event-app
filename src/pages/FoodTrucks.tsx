import React, { useMemo } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
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
} from '@ionic/react';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { mapFoodTruckData, FireDBFoodTruck } from '../utils/foodTruckUtils'; // Updated import

const FoodTrucks: React.FC = () => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBFoodTruck>('FoodTrucks');

  const layout = useMemo(() => {
    if (!data) return [];
    return mapFoodTruckData(data).filter((truck) => truck.title);
  }, [data]);

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
              <IonCard key={index}>
                <IonImg src={item.image} alt={item.title} />
                <IonCardHeader>
                  <IonCardTitle>{item.title}</IonCardTitle>
                  <IonCardSubtitle>
                    <IonChip
                      color={
                        item.statusMessage === 'Now Serving'
                          ? 'success'
                          : 'light'
                      }
                    >
                      {item.statusMessage}
                    </IonChip>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  {item.popularItem ? (
                    <IonButton
                      color={'light'}
                      fill="solid"
                      slot="end"
                      size={'small'}
                    >
                      <div>{item.popularItem}</div>
                      <div>{item.popularItemPrice}</div>
                    </IonButton>
                  ) : (
                    <div></div>
                  )}
                  <p>{item.description}</p>
                  <br></br>
                  <p>{item.menu}</p>
                  {item.link ? (
                    <IonButton
                      size={'small'}
                      color="secondary"
                      href={item.link}
                    >
                      Web site
                    </IonButton>
                  ) : (
                    <div />
                  )}
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

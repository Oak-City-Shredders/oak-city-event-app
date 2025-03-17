import React, { useMemo } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { IonCard, IonCardContent, IonCardHeader, IonRefresher, IonChip, IonRefresherContent, IonCardTitle, IonImg, IonCardSubtitle } from '@ionic/react';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { mapFoodTruckData, FireDBFoodTruck } from '../utils/foodTruckUtils'; // Updated import

const FoodTrucks: React.FC = () => {
    const { data, loading, error, refetch } =
        useFireStoreDB<FireDBFoodTruck>('FoodTrucks');

    const layout = useMemo(() => {
        if (!data) return [];
        return mapFoodTruckData(data);
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
                                            <IonChip color="success">Taking Orders Now</IonChip>
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
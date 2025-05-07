import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';

import useBands from '../hooks/useBands';
import PageHeader from '../components/PageHeader';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

const Bands: React.FC = () => {
  const { bands, loading, error, refetch } = useBands();
  const handleRefresh = useRefreshHandler(refetch);

  return (
    <IonPage>
      <PageHeader title="Bands" />
      <IonContent className="ion-padding" style={{ '--padding-top': 0 }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message="Error loading the bands" />
        ) : (
          <>
            {bands.map((band) => (
              <IonCard
                key={band.id}
                style={{ marginLeft: '8px', marginRight: '8px' }}
              >
                <img src={band.imageUrl} alt={band.name} />
                <IonCardHeader>
                  <IonCardTitle>{band.name}</IonCardTitle>
                  <IonCardSubtitle>{band.subtitle}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{band.description}</p>
                  {band.websiteLink && (
                    <a
                      href={band.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
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

export default Bands;

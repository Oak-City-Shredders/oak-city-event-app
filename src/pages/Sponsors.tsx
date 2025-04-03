import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonRefresher,
  IonRefresherContent,
  IonCardTitle,
  IonImg,
  RefresherEventDetail,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';

import useSponsors from '../hooks/useSponsors';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Team: React.FC = () => {
  const { sponsors, loading, error, refetch } = useSponsors();
  const handleCardClick = (route: string): void => {
    window.open(route, '_blank');
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from firebase db
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };
  return (
    <IonPage>
      <PageHeader title="Sponsors" />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message="Error loading the sponsors" />
          ) : (
            <>
              <IonGrid>
                <IonRow className="ion-align-items-stretch">
                  {sponsors.map((sponsor, index: number) => (
                    <IonCol
                      sizeXs="6"
                      sizeMd="4"
                      sizeLg="3"
                      key={index}
                      style={{ padding: '8px' }}
                    >
                      <IonCard
                        key={index}
                        onClick={() => handleCardClick(sponsor.websiteLink)}
                        style={{
                          margin: '0',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div
                          style={{ position: 'relative', paddingTop: '75%' }}
                        >
                          <IonImg
                            src={sponsor.imageLink}
                            alt={sponsor.name}
                            style={{
                              backgroundColor: '#e6e6e6', // Very light gray, almost white
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                        <IonCardHeader>
                          <IonCardTitle style={{ fontSize: '1.2em' }}>
                            {sponsor.name}
                          </IonCardTitle>
                        </IonCardHeader>
                        <div className="ion-hide-sm-down">
                          <IonCardContent
                            style={{
                              flexGrow: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {sponsor.description && (
                              <p>{sponsor.description}</p>
                            )}
                          </IonCardContent>
                        </div>
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Team;

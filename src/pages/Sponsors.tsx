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

const Team: React.FC = () => {
  const { sponsors, loading, error, refetch } = useSponsors();
  console.log(sponsors);
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
        {loading ? (
          <p>Loading food trucks...</p>
        ) : error ? (
          <p>Error loading food trucks</p>
        ) : (
          <>
            <IonGrid>
              <IonRow>
                {sponsors.map((sponsor, index: number) => (
                  <IonCol sizeXs="12" sizeSm="4" sizeLg="3" key={index}>
                    <IonCard
                      key={index}
                      onClick={() => handleCardClick(sponsor.websiteLink)}
                      style={{ marginTop: '6px', marginBottom: '6px' }}
                    >
                      <IonImg
                        src={sponsor.imageLink}
                        alt={sponsor.name}
                        style={{ backgroundColor: '#e6e6e6' }} // Very light gray, almost white
                      />
                      <IonCardHeader>
                        <IonCardTitle>{sponsor.name}</IonCardTitle>
                      </IonCardHeader>
                      {sponsor.description && (
                        <IonCardContent>
                          <p>{sponsor.description}</p>
                        </IonCardContent>
                      )}
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Team;

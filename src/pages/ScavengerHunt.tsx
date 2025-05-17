import React, { useState } from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonPage,
  IonText,
  IonCol,
  IonGrid,
  IonRow,
  IonCardHeader,
  IonCardTitle,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';

import PageHeader from '../components/PageHeader';
import useScavengerHunt from '../hooks/useScavengerHunt';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

const ScavengerHunt: React.FC = () => {
  const {
    scavengerHuntPrizes,
    scavengerHuntDetails,
    detailsLoading,
    detailsError,
    detailsRefetch,
  } = useScavengerHunt();
  const [selectedTab, setSelectedTab] = useState<string>('details');
  const handleCardClick = (route: string): void => {
    window.open(route, '_blank', 'noopener,noreferrer');
  };
  const handleRefresh = useRefreshHandler(detailsRefetch);
  return (
    <IonPage>
      <PageHeader title="Scavenger Hunt" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {detailsLoading ? (
          <LoadingSpinner />
        ) : detailsError ? (
          <ErrorMessage message="Error loading the scavenger hunt" />
        ) : (
          <>
            <div
              style={{
                margin: '16px',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '25vh',
              }}
            >
              <img
                src="/images/scavenger-hunt/fake-squirrels.webp"
                alt="Scavenger Hunt"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div style={{ margin: '16px', marginBottom: '0' }}>
              <IonSegment
                value={selectedTab}
                onIonChange={(e) => setSelectedTab(e.detail.value as string)}
              >
                <IonSegmentButton value="details">
                  <IonLabel>Details</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="prizes">
                  <IonLabel>Prizes</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
            {selectedTab === 'prizes' && (
              <IonGrid style={{ margin: '3px' }}>
                <IonRow
                  className="ion-align-items-stretch"
                  style={{ marginBottom: '16px' }}
                >
                  {scavengerHuntPrizes?.map((item) => (
                    <IonCol
                      key={item.id}
                      size="6"
                      sizeMd="4"
                      sizeLg="3"
                      sizeXl="2"
                      style={{ padding: '8px' }}
                    >
                      <IonCard
                        onClick={() => handleCardClick(item.websiteLink)}
                        style={{
                          margin: '0',
                          textAlign: 'center',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div
                          style={{ position: 'relative', paddingTop: '100%' }}
                        >
                          <img
                            alt={item.name}
                            src={item.imageLink}
                            style={{
                              background: 'lightgray',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <IonCardHeader style={{ paddingBottom: '0' }}>
                          <IonCardTitle style={{ fontSize: '1.3em' }}>
                            {item.name}
                          </IonCardTitle>
                          {/* <IonCardSubtitle>{item.prize}</IonCardSubtitle> */}
                        </IonCardHeader>
                        <IonCardContent
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            justifyContent: 'space-between',
                          }}
                        >
                          <IonLabel>{item.prize}</IonLabel>
                          <div style={{ marginTop: '8px' }}>
                            <IonLabel
                              style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                backgroundColor: item.sponsorshipTier || 'gold',
                                color: '#000',
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                width: '100%',
                                maxWidth: '200px',
                              }}
                            >
                              {item.sponsorshipTier} Squirrel
                            </IonLabel>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            )}

            {selectedTab === 'details' && (
              <>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle className="ion-text-center">
                      Hunt for squirrels, unlock the fun, and win prizes!
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent>
                    {scavengerHuntDetails?.map((item) => (
                      <div
                        key={item.id}
                        className={`${item.title ? 'ion-margin-top' : ''}`}
                      >
                        <IonText className="ion-margin-bottom">
                          <h2>
                            <b>{item.title}</b>
                          </h2>
                        </IonText>
                        <IonText>{item.description}</IonText>
                      </div>
                    ))}
                  </IonCardContent>
                </IonCard>
              </>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ScavengerHunt;

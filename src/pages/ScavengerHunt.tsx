import React, { useState } from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
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
  IonIcon,
} from '@ionic/react';
import { locationOutline, colorPaletteOutline } from 'ionicons/icons';

import PageHeader from '../components/PageHeader';
import useScavengerHunt from '../hooks/useScavengerHunt';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ScavengerHunt: React.FC = () => {
  const { scavengerHunt, loading, error, refetch } = useScavengerHunt();
  const [selectedTab, setSelectedTab] = useState<string>('details');
  const handleCardClick = (route: string): void => {
    window.open(route, '_blank');
  };
  return (
    <IonPage>
      <PageHeader title="Scavenger Hunt" />
      <IonContent>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message="Error loading the scavenger hunt" />
        ) : (
          <>
            <div
              style={{
                margin: '16px',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '25vh', // Viewport-based height
              }}
            >
              <img
                src="/images/scavenger-hunt-small.webp"
                alt="Scavenger Hunt"
                style={{ width: '100%', objectFit: 'cover', height: '100%' }}
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
                  {scavengerHunt?.map((item) => (
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
                      Hunt the squirrels, unlock the fun, win the fame!
                    </IonCardTitle>
                    {/* <IonCardSubtitle className="ion-text-center">
                    Starts Thursday morning and runs until the awards ceremony
                  </IonCardSubtitle> */}
                  </IonCardHeader>

                  <IonCardContent>
                    <div className="ion-margin-bottom">
                      <IonText>
                        <h2
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          <IonIcon
                            icon={locationOutline}
                            style={{ marginRight: '8px' }}
                          />{' '}
                          Where to Look
                        </h2>
                        <p>
                          The squirrels are scattered everywhere! From the
                          FloatTrack to Stoke Park, and even down by the lake,
                          you'll need your wits, eyes, and maybe a little luck
                          to find them all.
                        </p>
                      </IonText>
                    </div>

                    <div className="ion-margin-bottom">
                      <IonText>
                        <h2
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          <IonIcon
                            icon={colorPaletteOutline}
                            style={{ marginRight: '8px' }}
                          />{' '}
                          What to Look For
                        </h2>
                        <p>
                          There are three different squirrel colors, each with
                          unique prizes:
                        </p>
                      </IonText>

                      <IonItem lines="full">
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#9970FF',
                            marginRight: '16px',
                          }}
                        ></div>
                        <IonLabel>
                          <h2>Purple Squirrels</h2>
                          <p>
                            The person who collects the most purple squirrels
                            will snag an exclusive prize.
                          </p>
                        </IonLabel>
                      </IonItem>

                      <IonList>
                        <IonItem lines="full">
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#2dd36f',
                              marginRight: '16px',
                            }}
                          ></div>
                          <IonLabel>
                            <h2>Green Squirrels</h2>
                            <p>Win exciting prizes from our sponsors!</p>
                          </IonLabel>
                        </IonItem>

                        <IonItem lines="full">
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              marginRight: '16px',
                            }}
                          ></div>
                          <IonLabel>
                            <h2>Gold Squirrels</h2>
                            <p>
                              Score the big stuff with prizes valued at $150+!
                            </p>
                          </IonLabel>
                        </IonItem>
                      </IonList>
                    </div>
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

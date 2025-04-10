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
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { locationOutline, colorPaletteOutline } from 'ionicons/icons';

import PageHeader from '../components/PageHeader';
import useScavengerHunt from '../hooks/useScavengerHunt';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

const ScavengerHunt: React.FC = () => {
  const { scavengerHunt, loading, error, refetch } = useScavengerHunt();
  const [selectedTab, setSelectedTab] = useState<string>('details');
  const handleCardClick = (route: string): void => {
    window.open(route, '_blank');
  };
  const handleRefresh = useRefreshHandler(refetch);
  return (
    <IonPage>
      <PageHeader title="Scavenger Hunt" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
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
                      Hunt the squirrels, unlock the fun, win the trophy!
                    </IonCardTitle>
                    {/* <IonCardSubtitle className="ion-text-center">
                    Starts Thursday morning and runs until the awards ceremony
                  </IonCardSubtitle> */}
                  </IonCardHeader>

                  <IonCardContent>
                    <div className="ion-margin-bottom">
                      <IonText>
                        <p>
                          Welcome to the wildest hunt of the weekend, the Oak
                          City Shred Fest Scavenger Hunt! We’ve hidden hundreds
                          of 3D printed squirrels all around the event grounds,
                          and it’s your mission to find as many as you can.
                        </p>
                      </IonText>
                    </div>
                    <div className="ion-margin-bottom">
                      <div className="ion-margin-bottom">
                        <IonText>
                          <h2
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            📍 Where to Hunt
                          </h2>
                          <p>
                            Everywhere! From the Float Track to StOak Park, and
                            even down by the lake. Keep your eyes peeled, you
                            never know where one might be tucked away!
                          </p>
                        </IonText>
                      </div>

                      <IonText>
                        <h2
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '4px',
                          }}
                        >
                          🎨 Squirrel Colors & What They Mean
                        </h2>

                        <div>
                          <p>
                            🟣 Purple Squirrels – Standard squirrels. Most of
                            them are this color. Collect as many as you can!
                          </p>
                          <p>
                            🟢 Green Squirrels – Rare finds! Each green squirrel
                            is worth a prize valued at $50 or more.
                          </p>
                          <p>
                            🟡 Gold Squirrels – Ultra rare! There are only about
                            15 gold squirrels out there, and each one is worth a
                            prize valued at $150+, thanks to our amazing
                            sponsors.
                          </p>
                        </div>
                      </IonText>
                    </div>
                    <div className="ion-margin-bottom">
                      <IonText>
                        <h2
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          🏆 Win the Trophy
                        </h2>
                        <p>
                          The hunter with the most total squirrels (of any
                          color) will be crowned Squirrel Champion and take home
                          an epic trophy during the awards ceremony on Saturday
                          night.
                        </p>
                      </IonText>
                    </div>{' '}
                    <div className="ion-margin-bottom">
                      <IonText>
                        <h2
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          🎁 Claiming Prizes
                        </h2>
                        <p>
                          Bring all your squirrels to the awards ceremony to:
                        </p>
                        <div style={{ marginLeft: '16px' }}>
                          <p>- Count your total haul. </p>
                          <p>
                            - Claim prizes for any green or gold squirrels you
                            found.
                          </p>
                          <p>
                            - See if you’ve got what it takes to win the trophy!
                          </p>
                        </div>
                      </IonText>
                    </div>
                    <div>
                      <IonText>
                        <h2
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          ⏰ Hunt Duration
                        </h2>
                        <p>
                          The hunt kicks off when the gates open and runs until
                          the awards ceremony on Saturday night. You’ve got all
                          weekend to explore, search, and squirrel away your
                          prizes!
                        </p>
                      </IonText>
                    </div>{' '}
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

import React from 'react';
import {
  IonContent,
  IonPage,
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonItem,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { FireDBRacer } from './Racing';
import {
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
  IonLoading,
  IonText,
} from '@ionic/react';
import { getErrorMessage } from '../utils/errorUtils';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import './RacerProfile.css';

interface RouteParams {
  racerId: string;
}

const RacerProfile: React.FC = () => {
  const { racerId } = useParams<RouteParams>();
  const { data, loading, error, refetch } = useFireStoreDB<FireDBRacer>(
    'Sheet1',
    racerId
  );

  const racer = useMemo(() => {
    if (!data || data.length === 0) return null;

    const racer = {
      name: data[0]['Racer Name'],
      team: data[0]['Racer Team'],
      id: Number(data[0].id),
      photoLink: data[0]['Link to Photo'],
      comment: data[0].Comment,
      socialLink: data[0]['Link to Instagram'],
      ocsf4_qualifier: data[0]['OCSF4_qualifier'],
      nickName: data[0].Nickname,
    };

    return racer;
  }, [data]);

  const handleRefresh = useRefreshHandler(refetch);
  return (
    <IonPage>
      <PageHeader
        color="tertiary"
        title={racer ? racer.name : 'Racer Profile'}
      />
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <IonText>
            Error loading racer profile data, please check back later.
            {getErrorMessage(error)}
          </IonText>
        ) : !racer ? (
          <IonText>Racer Profile not found</IonText>
        ) : (
          <>
            <IonCard>
              {racer.photoLink && (
                <img alt={racer.name} src={racer.photoLink} />
              )}
              <IonCardHeader>
                <IonCardSubtitle>Racer info</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel>
                    <b>Name: </b>
                  </IonLabel>
                  <IonText>{racer.name}</IonText>
                </IonItem>
                {racer.nickName && (
                  <IonItem>
                    <IonLabel>
                      <b>AKA: </b>
                    </IonLabel>
                    <IonText>{racer.nickName}</IonText>
                  </IonItem>
                )}
                {racer.team && (
                  <IonItem>
                    <IonLabel>
                      <b>Team: </b>
                    </IonLabel>
                    <IonText>{racer.team}</IonText>
                  </IonItem>
                )}
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Racer Details</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="racer-stats" style={{ whiteSpace: 'pre-wrap' }}>
                  {racer.ocsf4_qualifier}
                </div>
              </IonCardContent>
            </IonCard>

            {racer.socialLink && (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Social Media</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    <a
                      href={racer.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </p>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RacerProfile;

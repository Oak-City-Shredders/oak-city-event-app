import React, { useEffect, useState } from 'react';
import {
  IonLabel,
  IonIcon,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  useIonRouter,
  IonImg,
} from '@ionic/react';
import { trophy, people, star } from 'ionicons/icons';

import './RacerSpotlight.css';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { FireDBRacer } from '../pages/Racing';
import { useRandomRacerId } from '../hooks/useRefetchableData';
interface RacerSpotlightProps {}

const RacerSpotlight: React.FC<RacerSpotlightProps> = ({}) => {
  const router = useIonRouter();
  const { racerId, loading: loadingId, error: errorId } = useRandomRacerId();

  const { data, loading, error } = useFireStoreDB<FireDBRacer>(
    'Sheet1',
    racerId || '',
    [],
    [!!racerId]
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const handleDescriptionClick = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading || error || !data || data.length < 1) {
    return <></>;
  }

  const racer = data[0];

  return (
    <IonCard className="racer-spotlight-card" onClick={undefined}>
      <IonCardHeader className="racer-card-header">
        <IonCardSubtitle className="racer-card-subtitle" color="primary">
          <div className="racer-spotlight-header">
            <IonLabel>
              <IonIcon slot="start" icon={star}></IonIcon>&nbsp;
              {`Featured Competitor`}{' '}
            </IonLabel>
            <IonButton
              className="racer-view-all"
              color={'light'}
              fill="solid"
              slot="end"
              size={'small'}
              onClick={(e) => {
                e.stopPropagation();
                router.push('/race-information');
              }}
            >
              <IonIcon slot="start" icon={people}></IonIcon>
              View All
            </IonButton>
          </div>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className="racer-card-content">
        <IonImg
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/racer-profile/${racer.id}`);
          }}
          src={racer['Link to Photo']}
          alt="Racer"
          className="racer-image"
        />

        <div className="racer-summary-and-description">
          <div onClick={handleDescriptionClick} className="racer-name">
            {racer['Racer Name']}
          </div>
          <div
            onClick={handleDescriptionClick}
            className={`racer-description ${isExpanded ? 'expanded' : ''}`}
          >
            {racer.Comment}
          </div>
          {racer.Accomplishments && (
            <div className="racer-accomplishments">{racer.Accomplishments}</div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RacerSpotlight;

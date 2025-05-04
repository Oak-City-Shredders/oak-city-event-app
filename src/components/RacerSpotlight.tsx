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
  IonThumbnail,
  IonSkeletonText,
} from '@ionic/react';
import { people, star } from 'ionicons/icons';

import './RacerSpotlight.css';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { FireDBRacer } from '../pages/Racing';
import { useRandomRacerId } from '../hooks/useRefetchableData';
interface RacerSpotlightProps {}

const RacerSpotlight: React.FC<RacerSpotlightProps> = ({}) => {
  const router = useIonRouter();
  const {
    racerId,
    error: errorId,
    loading: loadingRandom,
  } = useRandomRacerId();

  const { data, error, loading } = useFireStoreDB<FireDBRacer>(
    'Sheet1',
    racerId || '',
    [],
    [!!racerId]
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const handleDescriptionClick = () => {
    setIsExpanded(!isExpanded);
  };

  if (error || errorId) {
    return <></>;
  }

  const racer =
    data && data.length > 0 && !loadingRandom && !loading ? data[0] : null;

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
        {racer ? (
          <IonImg
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/racer-profile/${racer.id}`);
            }}
            src={racer['Link to Photo']}
            alt="Racer"
            className="racer-image"
          />
        ) : (
          <IonThumbnail slot="start">
            <IonSkeletonText animated={true}></IonSkeletonText>
          </IonThumbnail>
        )}

        <div className="racer-summary-and-description">
          <div onClick={handleDescriptionClick} className="racer-name">
            {racer ? (
              racer['Racer Name']
            ) : (
              <IonSkeletonText animated={true}></IonSkeletonText>
            )}
          </div>
          <div
            onClick={handleDescriptionClick}
            className={`racer-description ${isExpanded ? 'expanded' : ''}`}
          >
            {racer ? (
              racer.Comment
            ) : (
              <IonSkeletonText animated={true}></IonSkeletonText>
            )}
          </div>
          {racer && racer.Accomplishments && (
            <div className="racer-accomplishments">{racer.Accomplishments}</div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RacerSpotlight;

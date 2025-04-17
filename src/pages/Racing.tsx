import './Racing.css';
import React, { useMemo, useState, useEffect } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonItemGroup,
  IonItemDivider,
  IonRefresher,
  IonRefresherContent,
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { getErrorMessage } from '../utils/errorUtils';
import PageHeader from '../components/PageHeader';
import {
  imageOutline,
  informationCircle,
  informationCircleOutline,
  ticket,
  mail,
} from 'ionicons/icons';
import divisions from '../data/RacingDivisions.json';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';
import { chevronDown, chevronForward } from 'ionicons/icons';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { useIonRouter } from '@ionic/react';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

export interface Racer {
  name: string;
  team?: string;
  id: number;
  photoLink: string;
  comment: string;
  socialLink: string;
  nickName: string;
}

interface Division {
  id: number;
  name: string;
  description?: string;
  descriptionExpanded?: boolean;
  descriptionTextExpanded?: boolean;
  racers: Racer[];
}

export interface FireDBRacer {
  Category: string;
  Comment: string;
  'Link to Instagram': string;
  'Link to Photo': string;
  'Racer Name': string;
  'Racer Team': string;
  Nickname: string;
  OCSF4_qualifier: string;
  id: string;
  Accomplishments: string;
}

const Raceing: React.FC = () => {
  const { notificationPermission } = useNotificationPermissions();
  const router = useIonRouter();

  const {
    data: sheetsData,
    loading,
    error,
    refetch,
  } = useFireStoreDB<FireDBRacer>('Sheet1');

  const memorizedGroupedDivisions: Division[] = useMemo(() => {
    if (!sheetsData) return [];

    const data: { division: string; racer: Racer }[] = sheetsData
      .filter((racer) => racer['Racer Name']) //filter out records without a Racer Name
      .map((racer) => ({
        division: racer.Category,
        racer: {
          name: racer['Racer Name'],
          team: racer['Racer Team'],
          id: Number(racer.id),
          photoLink: racer['Link to Photo'],
          comment: racer.Comment,
          socialLink: racer['Link to Instagram'],
          nickName: racer['Nickname'],
        },
      }));

    const grouped = data.reduce<Record<string, Racer[]>>(
      (acc, { division: division, racer }) => {
        if (!acc[division]) acc[division] = [];
        acc[division].push(racer);
        return acc;
      },
      {}
    );

    return Object.entries(grouped)
      .map(([name, racers], id) => {
        const description =
          divisions.find((d) => d.division === name)?.description || '';
        return {
          id,
          description,
          name,
          racers,
          descriptionExpanded: true,
          descriptionTextExpanded: false,
        };
      })
      .sort((a, b) => {
        // Put Unknown at the end
        if (a.name === 'Unknown') return 1;
        if (b.name === 'Unknown') return -1;

        // Sort by racer count first (descending)
        const racerDiff = b.racers.length - a.racers.length;
        if (racerDiff !== 0) return racerDiff;

        // If racer counts are equal, sort by name alphabetically
        return a.name.localeCompare(b.name);
      });
  }, [sheetsData]);

  useEffect(() => {
    if (memorizedGroupedDivisions.length > 0) {
      setGroupDivisions(memorizedGroupedDivisions);
    }
  }, [memorizedGroupedDivisions]);

  const handleRefresh = useRefreshHandler(refetch);
  const [groupedDivisions, setGroupDivisions] = useState<Division[]>([]);

  const toggleDivision = (divisionId: number) => {
    setGroupDivisions((prev) =>
      prev.map((d) =>
        d.id === divisionId
          ? { ...d, descriptionExpanded: !d.descriptionExpanded }
          : d
      )
    );
  };

  const onClickDivisionText = (division: Division) => {
    setGroupDivisions((prev) =>
      prev.map((d) =>
        d.id === division.id
          ? { ...d, descriptionTextExpanded: !d.descriptionTextExpanded }
          : d
      )
    );
  };

  const navigateToRacerProfile = (racerId: number) => {
    router.push(`/racer-profile/${racerId}`);
  };

  return (
    <IonPage>
      <PageHeader title="Registered Racers" />
      <IonContent fullscreen className="ion-padding">
        {/* Hero Section */}
        <div className="hero-section">
          <img
            src="/images/race2.webp"
            alt="PEV Racing"
            className="hero-image"
          />
          <div className="hero-overlay">
            <p className="hero-text">Some squirrels like to float.</p>
            <p className="hero-text">These squirrels prefer to fly!</p>
          </div>
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Quick Actions</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton
              expand="block"
              href={
                'https://www.oakcityshredfest.com/2025-tickets/p/ultimate-racer-bundle'
              }
              className="mb-3"
            >
              <IonIcon icon={ticket} slot="start" />
              Purchase Ticket
            </IonButton>

            <IonButton
              expand="block"
              color="secondary"
              href="mailto:racing@oakcityshredders.org?subject=Race Inquiry - Oak City Shred Fest&body=Hi Team,%0D%0A%0D%0AI have a question about racing at Oak City Shred Fest..."
            >
              <IonIcon icon={mail} slot="start" />
              Contact Racing Organizers
            </IonButton>

            <IonButton
              expand="block"
              color="tertiary"
              href="mailto:racer-profile@oakcityshredders.org?subject=Please Update my Racing Profile&body=Provide information here that you would like to add or change.  Make sure to provide your registered racing name."
            >
              <IonIcon icon={mail} slot="start" />
              Update Racing Profile
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <IonSpinner name="dots" />
        ) : error ? (
          <IonText color="danger">
            <p>Error loading racing data, please check back later.</p>
            <p>{getErrorMessage(error)}</p>
          </IonText>
        ) : !groupedDivisions || groupedDivisions.length === 0 ? (
          <IonText>No racers are currently available to be shown.</IonText>
        ) : (
          <>
            <IonList>
              {groupedDivisions.map((division) => {
                const wordLimit = 20; // Adjust as needed
                const words = division.description?.split(' ') ?? [];

                return (
                  <IonItemGroup key={division.id}>
                    <IonItemDivider
                      slot="header"
                      color="secondary"
                      //button
                      onClick={() => toggleDivision(division.id)}
                    >
                      <IonText class="ion-text-nowrap" slot="start">
                        {`${division.name}`}
                      </IonText>
                      <IonText>&nbsp;{`(${division.racers.length})`}</IonText>{' '}
                      <IonIcon
                        icon={
                          division.descriptionExpanded
                            ? informationCircle
                            : informationCircleOutline
                        }
                        slot="end"
                      />
                    </IonItemDivider>

                    <div slot="content">
                      {division.descriptionExpanded && (
                        <IonCard>
                          <IonCardContent>
                            <IonText>
                              {division.descriptionTextExpanded
                                ? division.description
                                : words.slice(0, wordLimit).join(' ') +
                                  (words.length > wordLimit ? '...' : '')}
                            </IonText>
                            {words.length > wordLimit && (
                              <IonIcon
                                onClick={() => onClickDivisionText(division)}
                                slot="end"
                                icon={
                                  division.descriptionTextExpanded
                                    ? chevronDown
                                    : chevronForward
                                }
                              />
                            )}
                          </IonCardContent>
                        </IonCard>
                      )}

                      <IonList>
                        {division.racers.map((racer, index) => (
                          <IonItem
                            detail={true}
                            key={index}
                            onClick={() => navigateToRacerProfile(racer.id)}
                          >
                            <div className="racer-item-content">
                              <span className="racer-name">
                                {racer.nickName ? racer.nickName : racer.name}
                              </span>
                              {racer.team && (
                                <>
                                  <span className="team-separator">•</span>
                                  <span className="team-name">
                                    {racer.team}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="icons-container">
                              {racer.comment && (
                                <IonIcon
                                  color="medium"
                                  icon={informationCircleOutline}
                                />
                              )}
                              {racer.photoLink && (
                                <IonIcon color="medium" icon={imageOutline} />
                              )}
                            </div>
                          </IonItem>
                        ))}
                      </IonList>
                    </div>
                  </IonItemGroup>
                );
              })}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Raceing;

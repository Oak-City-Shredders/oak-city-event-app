import React, { useMemo, useState, useEffect } from 'react';
import {
  RefresherEventDetail,
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
  IonText,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { getErrorMessage } from '../utils/errorUtils';
import PageHeader from '../components/PageHeader';
import { informationCircle, informationCircleOutline } from "ionicons/icons";
import divisions from '../data/RacingDivisions.json';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';
import { chevronDown, chevronForward } from 'ionicons/icons';
import NotificationToggle from '../components/NotificationToggle';
import useFireStoreDB from '../hooks/useFireStoreDB';
interface Racer {
  name: string;
  team?: string;
}

interface Division {
  id: number;
  name: string;
  description?: string;
  descriptionExpanded?: boolean;
  descriptionTextExpanded?: boolean;
  racers: Racer[];
}

interface FireDBRacer {
  "Category": string;
  "Comment": string;
  "Link to Instagram": string;
  "Link to Photo": string;
  "Racer Name": string;
  "Racer Team": string;
  id: string;
}

const RACING_TOPIC = 'racing';

const Raceing: React.FC = () => {
  const { notificationPermission } = useNotificationPermissions();


  const {
    data: sheetsData,
    loading,
    error,
    refetch,
  } = useFireStoreDB<FireDBRacer>("Sheet1");

  const memorizedGroupedDivisions: Division[] = useMemo(() => {
    if (!sheetsData) return [];

    const data: { division: string; racer: Racer }[] = sheetsData
      .filter(racer => racer['Racer Name'])
      .map((racer) => ({
        division: racer.Category,
        racer: { name: racer['Racer Name'], team: racer['Racer Team'] },
      }));

    const grouped = data.reduce<Record<string, Racer[]>>(
      (acc, { division: division, racer }) => {
        if (!acc[division]) acc[division] = [];
        acc[division].push(racer);
        return acc;
      },
      {}
    );

    return Object.entries(grouped).map(([name, racers], id) => {
      const description = divisions.find(d => d.division === name)?.description || "";
      return {
        id,
        description,
        name,
        racers,
        descriptionExpanded: true,
        descriptionTextExpanded: false,
      }
    });
  }, [sheetsData]);

  useEffect(() => {
    if (memorizedGroupedDivisions.length > 0) {
      setGroupDivisions(memorizedGroupedDivisions);
    }
  }, [memorizedGroupedDivisions]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from firebase db
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  const [groupedDivisions, setGroupDivisions] = useState<Division[]>([]);

  const toggleDivision = (divisionId: number) => {
    setGroupDivisions(prev => prev.map(d =>
      d.id === divisionId ? { ...d, descriptionExpanded: !d.descriptionExpanded } : d));
  };

  const onClickDivisionText = (division: Division) => {
    setGroupDivisions(prev => prev.map(d =>
      d.id === division.id ? { ...d, descriptionTextExpanded: !d.descriptionTextExpanded } : d));
  }

  return (
    <IonPage>
      <PageHeader title="Registered Racers" />
      <IonContent fullscreen className="ion-padding">
        <NotificationToggle topic={RACING_TOPIC} />

        <IonCard>
          <img src="/images/race2.webp" alt="Luke Austin" style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "cover" }} />
          <IonCardContent>
            <IonText>The following people have purchased race tickets for Oak City Shred Fest 5.  Want to race against them?&nbsp;</IonText>
            <IonText>

              <a
                href={"https://www.oakcityshredfest.com/2025-tickets/p/ultimate-racer-bundle"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ whiteSpace: "nowrap" }}
              >
                Get your ticket here
              </a>
            </IonText>
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
                const words = division.description?.split(" ") ?? [];

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
                      <IonText >{`(${division.racers.length})`}</IonText> <IonIcon
                        icon={division.descriptionExpanded ? informationCircle : informationCircleOutline}
                        slot="end"
                      />
                    </IonItemDivider>


                    <div slot="content">

                      {division.descriptionExpanded && (
                        <IonCard>
                          <IonCardContent>
                            <IonText>
                              {division.descriptionTextExpanded ? division.description : words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "")}
                            </IonText>
                            {(words.length > wordLimit) && (
                              <IonIcon
                                onClick={() => onClickDivisionText(division)}
                                slot="end"
                                icon={division.descriptionTextExpanded ? chevronDown : chevronForward}
                              />
                            )}
                          </IonCardContent>
                        </IonCard>
                      )}

                      <IonList>
                        {division.racers.map((racer, index) => (
                          <IonItem key={index}>
                            <IonLabel>
                              {racer.name} {racer.team ? `[${racer.team}]` : ""}
                            </IonLabel>
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

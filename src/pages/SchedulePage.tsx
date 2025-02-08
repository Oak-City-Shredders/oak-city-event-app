import React, { useMemo } from "react";
import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonLabel, IonList, IonItem, IonText, IonLoading, IonPage, IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import useGoogleCalendar from "../hooks/useGoogleCalendar"; // Assuming custom hook for Google Calendar
import { groupEventsByDays, isToday, getDayName } from "../utils/calenderUtils";
import { getErrorMessage } from "../utils/errorUtils";
import { useIonRouter } from "@ionic/react";

const CALENDAR_ID: string = import.meta.env.VITE_REACT_APP_CALENDAR_ID || '';
const SchedulePage: React.FC = () => {
  const router = useIonRouter();
  const { data: calendarData, loading, error } = useGoogleCalendar(CALENDAR_ID);
  const groupedEvents = useMemo(() => {
    return groupEventsByDays(calendarData);
  }, [calendarData]);
  const navigateToMap = (eventLocation: string) => {
    router.push(`/map/${eventLocation}`);
  };

  return (
    <IonPage>
      <IonHeader>
            <IonToolbar>
              <IonTitle>Schedule</IonTitle>
            </IonToolbar>
          </IonHeader>
      <IonContent>
      <IonItem>
        <IonLabel class="ion-text-wrap">
          This schedule is subject to change. Please check back for updates.
        </IonLabel>
      </IonItem>
        {loading ? (
          <IonLoading isOpen={loading} message={"Loading..."} />
        ) : error ? (
          <IonText>
            Error loading calendar data, please check back later.

            { getErrorMessage(error) }
            
          </IonText>
        ) : !calendarData || calendarData.length === 0 ? (
          <IonText>
            There are currently no events available.
          </IonText>
        ) : (
          <IonAccordionGroup multiple={true}>
            {Object.keys(groupedEvents).map((day) => (
              <IonAccordion key={day} value={day} defaultChecked={isToday(day)}>
                <IonItem slot="header" color="light">
                
                  <IonLabel>{getDayName(day)}</IonLabel>
                
              </IonItem>
              
                <div slot="content">
                  <IonList>
                    {groupedEvents[day].map((item, index) => (
                      <IonItem key={index} lines={index < groupedEvents[day].length - 1 ? "full" : "none"}>
                        
                        {item.icon}
                        
                        <IonLabel>
                          <h2>{item.startTime}</h2>
                          <p>
                            <strong>{item.title}</strong>
                            {item.description && ` - ${item.description}`}
                            {item.location && (
                              <span onClick={() => navigateToMap(item.location)}>
                                {` at the ${item.location}`}
                              </span>
                            )}
                          </p>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              </IonAccordion>
            ))}
          </IonAccordionGroup>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SchedulePage;
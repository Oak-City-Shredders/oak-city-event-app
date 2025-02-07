import React, { useMemo } from "react";
import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonLabel, IonList, IonItem, IonText, IonLoading, IonPage, IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import useGoogleCalendar from "../hooks/useGoogleCalendar"; // Assuming custom hook for Google Calendar
import { groupEventsByDays, isToday, getDayName } from "../utils/calenderUtils";
import { alarm, analytics } from "ionicons/icons";
import { an } from "vitest/dist/reporters-5f784f42";
import { getErrorMessage } from "../utils/errorUtils";

//import { CalendarOutline } from "ionicons/icons";

const CALENDAR_ID: string = import.meta.env.VITE_REACT_APP_CALENDAR_ID || '';
const SchedulePage: React.FC = () => {
  const { data: calendarData, loading, error } = useGoogleCalendar(CALENDAR_ID);
  const groupedEvents = useMemo(() => {
    return groupEventsByDays(calendarData);
  }, [calendarData]);

  return (
    <IonPage>
      <IonHeader>
            <IonToolbar>
              <IonTitle>Schedule</IonTitle>
            </IonToolbar>
          </IonHeader>
      <IonContent>
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
                            {item.location && ` at the ${item.location}`}
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
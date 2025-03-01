import React, { useMemo } from 'react';
import {
  RefresherEventDetail,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonRefresher,
  IonRefresherContent,
  IonContent,
  IonLabel,
  IonList,
  IonItem,
  IonText,
  IonLoading,
  IonPage
} from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import useGoogleCalendar from '../hooks/useGoogleCalendar'; // Assuming custom hook for Google Calendar
import {
  groupEventsByDays,
  isToday,
  getFormattedDate,
} from '../utils/calenderUtils';
import { getErrorMessage } from '../utils/errorUtils';
import { useIonRouter } from '@ionic/react';
import PageHeader from '../components/PageHeader';

const CALENDAR_ID: string = import.meta.env.VITE_REACT_APP_CALENDAR_ID || '';
const SchedulePage: React.FC = () => {
  const router = useIonRouter();
  const {
    data: calendarData,
    loading,
    error,
    refetch,
  } = useGoogleCalendar(CALENDAR_ID);
  const groupedEvents = useMemo(() => {
    return groupEventsByDays(calendarData);
  }, [calendarData]);
  const navigateToMap = (eventLocation: string) => {
    router.push(`/map/${eventLocation}`);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from google calendar
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  return (
    <IonPage>
      <PageHeader title="Schedule" />
      <IonContent>
        <IonItem>
          <IonLabel class="ion-text-wrap">
            This schedule is subject to change. Refresh (or swipe down) for the
            latest changes.
          </IonLabel>
        </IonItem>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : error ? (
          <IonText>
            Error loading calendar data, please check back later.
            {getErrorMessage(error)}
          </IonText>
        ) : !calendarData || calendarData.length === 0 ? (
          <IonText>There are currently no events available.</IonText>
        ) : (
          <IonAccordionGroup multiple={true}>
            {Object.keys(groupedEvents).map((day) => (
              <IonAccordion key={day} value={day} defaultChecked={isToday(day)}>
                <IonItem slot="header" color="light">
                  <IonLabel>{getFormattedDate(day)}</IonLabel>
                </IonItem>

                <div slot="content">
                  <IonList>
                    {groupedEvents[day].map((item, index) => (
                      <IonItem
                        key={index}
                        lines={
                          index < groupedEvents[day].length - 1
                            ? 'full'
                            : 'none'
                        }
                      >
                        {item.icon}
                        <IonLabel>
                          <h2>{item.startTime}</h2>
                          <p>
                            <strong>{item.title}</strong>
                            {item.description && ` - ${item.description} `}
                            {item.location && (
                              <IonLabel
                                onClick={() => navigateToMap(item.location)}
                              >
                                {` at the `}{' '}
                                <span
                                  style={{
                                    textDecoration: 'underline',
                                  }}
                                >
                                  <IonIcon icon={locationOutline} />
                                  {item.location}
                                </span>
                              </IonLabel>
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

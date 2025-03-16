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
  IonPage,
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
import NotificationToggle from '../components/NotificationToggle';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

const SchedulePage: React.FC = () => {
  const router = useIonRouter();
  const { data: calendarData, loading, error, refetch } = useGoogleCalendar();
  const groupedEvents = useMemo(() => {
    return groupEventsByDays(calendarData);
  }, [calendarData]);
  const navigateToMap = (eventLocation: string) => {
    router.push(`/map/${eventLocation}`);
  };

  const firstKey =
    Object.keys(groupedEvents).length > 0 ? Object.keys(groupedEvents)[0] : '';
  const handleRefresh = useRefreshHandler(refetch);

  return (
    <IonPage>
      <PageHeader title="Schedule" />
      <IonContent>
        <NotificationToggle topic="schedule" />
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
          <IonAccordionGroup multiple={true} value={firstKey}>
            {Object.keys(groupedEvents).map((day) => (
              <IonAccordion key={day} value={day}>
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
                          <div>
                            <strong>{item.title}</strong>
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                              {item.description && ` - ${item.description} `}
                            </div>
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
                          </div>
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

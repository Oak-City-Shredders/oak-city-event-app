import React, { useMemo } from 'react';
import {
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
  IonPage,
} from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import useGoogleCalendar from '../hooks/useGoogleCalendar'; // Assuming custom hook for Google Calendar
import DOMPurify from 'dompurify';
import { groupEventsByDays, getFormattedDate } from '../utils/calenderUtils';
import { getErrorMessage } from '../utils/errorUtils';
import { useIonRouter } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import NotificationToggle from '../components/NotificationToggle';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import './SchedulePage.css';

const SchedulePage: React.FC = () => {
  const router = useIonRouter();
  const { data: calendarData, loading, error, refetch } = useGoogleCalendar();
  const groupedEvents = useMemo(() => {
    return groupEventsByDays(calendarData);
  }, [calendarData]);

  const navigateToMap = (eventLocation: string) => {
    const normalizedLocation = eventLocation.trim().toLowerCase();

    const internalLocations = [
      'front gate',
      'stoak park',
      'qualifier',
      'floattrack',
      'lakeside stage',
      'stage',
      'oak city tent',
    ];

    let query = '';

    if (normalizedLocation === 'joasis') {
      query = '316 Cutler St, Raleigh NC';
    } else if (internalLocations.includes(normalizedLocation)) {
      router.push(`/map/${normalizedLocation}`);
      return;
    } else {
      query = eventLocation;
    }

    const encodedQuery = encodeURIComponent(query);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
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
          <p>Loading events...</p>
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
                          <IonText color="medium">
                            <h3>
                              {item.startTime} - {item.endTime}
                            </h3>
                          </IonText>
                          <div>
                            <IonText className="schedule-text">
                              {item.title}
                            </IonText>
                            <IonText
                              className="schedule-description"
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              <h3
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(item.description),
                                }}
                              />
                            </IonText>
                            {item.location && (
                              <IonLabel
                                onClick={() => navigateToMap(item.location)}
                              >
                                <IonText color="medium">
                                  <h3>
                                    {` at the `}{' '}
                                    <span
                                      style={{
                                        textDecoration: 'underline',
                                      }}
                                    >
                                      <IonIcon icon={locationOutline} />
                                      <IonText
                                        color="secondary"
                                        className="bold-font"
                                      >
                                        {item.location}
                                      </IonText>
                                    </span>
                                  </h3>
                                </IonText>
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

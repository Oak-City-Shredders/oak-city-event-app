import { useEffect, useState } from 'react';
import { IonIcon, IonSkeletonText, IonText, useIonRouter } from '@ionic/react';
import styles from './TicketCounter.module.css';
import { useAuth } from '../context/AuthContext';
import { ticket } from 'ionicons/icons';
import { useCurrentEvent } from '../context/CurrentEventContext';

export interface FireDBTicketsSold {
  Sold: string;
  id: string;
}

interface TicketCounterProps {
  data: FireDBTicketsSold[] | null;
  loading: boolean;
  error: any;
}

export default function TicketCounter({
  data,
  loading,
  error,
}: TicketCounterProps) {
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { user, loading: authLoading, error: authError } = useAuth();
  const { eventInfo } = useCurrentEvent();
  const router = useIonRouter();

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Firestore error:', error);
      setLocalError('Error loading ticket data. Tap for details.');
      setRawError(error);
    } else if (authError) {
      console.error('Auth error:', authError);
      setLocalError('Authentication error. Tap for details.');
      setRawError(authError);
    } else {
      setLocalError(null);
      setRawError(null);
      setShowDetails(false);
    }
  }, [error, authError]);

  // Calculate total tickets sold
  useEffect(() => {
    if (!data || error) return;

    const sold: number = data.reduce(
      (acc, rec) => acc + parseInt(rec.Sold, 10),
      0
    );
    setTicketsSold(sold);
  }, [data, error]);

  // Animate counter
  useEffect(() => {
    let count = 0;
    let speed = 150; // Initial speed (in ms)

    const updateCounter = () => {
      if (count >= ticketsSold) {
        setTicketCount(ticketsSold);
        return;
      }

      count += 1;
      setTicketCount(count);
      // Reduce the interval time to create an accelerating effect
      speed = Math.max(5, speed * 0.97); // Decrease speed (min 5ms)

      setTimeout(updateCounter, speed);
    };

    updateCounter();
  }, [ticketsSold]);

  const handleViewTickets = () => {
    if (user && user.emailVerified) {
      router.push('/tickets');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className={styles.ticketCount}>
      {loading || authLoading ? (
        <IonSkeletonText animated={true} className={styles.skeleton} />
      ) : localError ? (
        <div
          className={styles.errorMessage}
          onClick={() => setShowDetails(!showDetails)}
        >
          <IonText color="danger">
            <p>{localError}</p>
            {showDetails && rawError && (
              <pre className={styles.errorDetails}>
                {typeof rawError === 'string'
                  ? rawError
                  : JSON.stringify(rawError, null, 2)}
              </pre>
            )}
          </IonText>
        </div>
      ) : (
        <>
          <IonText color="dark">
            <div className={styles.ticketCountText}>
              {ticketCount} Tickets Sold!
            </div>
          </IonText>

          {eventInfo.ticketsEnabled && (
            <>
              {!user && (
                <p className={styles.subtitle}>Sign in to view your tickets</p>
              )}

              <button onClick={handleViewTickets} className={styles.viewButton}>
                <IonIcon icon={ticket} />
                {user ? 'View My Tickets' : 'Sign In'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

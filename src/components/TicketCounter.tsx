import { useEffect, useState } from 'react';
import { IonIcon, IonSkeletonText, IonText, useIonRouter } from '@ionic/react';
import useFireStoreDB from '../hooks/useFireStoreDB';
import styles from './TicketCounter.module.css';
import { useAuth } from '../context/AuthContext';
import { ticket } from 'ionicons/icons';

interface FireDBTicketsSold {
  Sold: string;
  id: string;
}

export default function TicketCounter() {
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const { user } = useAuth();
  const router = useIonRouter();

  const { data, loading } = useFireStoreDB<FireDBTicketsSold>('TicketsSold');
  let testLoading = true;

  useEffect(() => {
    const sold: number = !data
      ? 0
      : data.reduce((acc, rec) => acc + parseInt(rec.Sold, 10), 0);
    setTicketsSold(sold);
  }, [data]);

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
      {loading ? (
        <IonSkeletonText animated={true} className={styles.skeleton} />
      ) : (
        <>
          <IonText color="dark">
            <h2>{ticketCount} Tickets Sold!</h2>
          </IonText>
          {!user && (
            <p className={styles.subtitle}>Sign in to view your tickets</p>
          )}
          <button onClick={handleViewTickets} className={styles.viewButton}>
            <IonIcon icon={ticket} />
            {user ? 'View My Tickets' : 'Sign In'}
          </button>
        </>
      )}
    </div>
  );
}

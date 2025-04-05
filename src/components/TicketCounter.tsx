import { useEffect, useState } from 'react';
import { IonSkeletonText, IonText } from '@ionic/react';
import './TicketCounter.css';
import useFireStoreDB from '../hooks/useFireStoreDB';

interface FireDBTicketsSold {
  Sold: string;
  id: string;
}

export default function TicketCounter() {
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);

  const { data, loading } = useFireStoreDB<FireDBTicketsSold>('TicketsSold');

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

  return (
    <div className="ticket-count">
      <IonText>
        {loading ? (
          <IonSkeletonText animated={true} />
        ) : (
          <IonText color="dark">
            <h2>{ticketCount} Tickets Sold!</h2>
          </IonText>
        )}
      </IonText>
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
import { IonSkeletonText, IonText } from '@ionic/react';
import styles from './TicketCounter.module.css';
import useFireStoreDB from '../hooks/useFireStoreDB';
import ReactDOM from 'react-dom';

interface FireDBTicketsSold {
  Sold: string;
  id: string;
}

export default function TicketCounter() {
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [isMinified, setIsMinified] = useState(false);
  const [isInPortal, setIsInPortal] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const portalRoot = document.getElementById('overlay-root');

  const { data, loading } = useFireStoreDB<FireDBTicketsSold>('TicketsSold');

  useEffect(() => {
    const sold: number = !data
      ? 0
      : data.reduce((acc, rec) => acc + parseInt(rec.Sold, 10), 0);
    setTicketsSold(sold);
  }, [data]);

  useEffect(() => {
    let count = 0;
    let speed = 150;

    const updateCounter = () => {
      if (count >= ticketsSold || (isMinified && isInPortal)) {
        setTicketCount(ticketsSold);
        return;
      }

      count += 1;
      setTicketCount(count);
      speed = Math.max(5, speed * 0.97);
      setTimeout(updateCounter, speed);
    };

    updateCounter();
  }, [ticketsSold]);

  const handleTicketCounterClick = () => {
    if (!isMinified) {
      // Minify: animate first, then portal
      setIsMinified(true);
      setTimeout(() => {
        setIsInPortal(true);
      }, 1000); // Match your CSS transition duration
    } else {
      // Unminify: remove from portal first, then restore
      setIsInPortal(false);

      setIsMinified(false);
    }
  };

  const content = (
    <div
      className={`${
        isMinified
          ? isInPortal
            ? styles.ticketCounterContainerMinified
            : styles.ticketCounterContainerMinifying
          : styles.ticketCounterContainer
      } ${styles.ticketComponent}`}
      onClick={handleTicketCounterClick}
    >
      <IonText>
        <h1 className={styles.ticketCountHeader}>
          {loading ? (
            <IonSkeletonText animated={true} />
          ) : (
            `${ticketCount} Tickets Sold!`
          )}
        </h1>
      </IonText>
    </div>
  );

  if (isInPortal && portalRoot) {
    return ReactDOM.createPortal(content, portalRoot);
  }

  return content;
}

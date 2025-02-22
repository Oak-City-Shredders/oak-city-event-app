import { useEffect, useState } from 'react';
import { IonText } from '@ionic/react';
import useGoogleSheets from '../hooks/useGoogleSheets';
import './TicketCounter.css';

export default function TicketCounter() {
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);

  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'TicketsSold!A:J';

  const { data } = useGoogleSheets(SHEET_ID, RANGE);

  useEffect(() => {
    const sold: number = !data
      ? 0
      : data
          .slice(1) // Skip header row
          .reduce((acc, [sold]: string[]) => acc + parseInt(sold, 10), 0);
    setTicketsSold(sold);
  }, [data]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setTicketCount(count);
      if (count === ticketsSold) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [ticketsSold]);

  return (
    <div className="ticket-count">
      <IonText>
        <h1>{ticketCount} Tickets Sold!</h1>
      </IonText>
    </div>
  );
}

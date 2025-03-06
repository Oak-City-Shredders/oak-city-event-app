import './CountdownTimer.css';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import dayjs from 'dayjs';

const festivalStartDate = new Date('2025-04-24T08:00:00-04:00').getTime(); // 8:00 AM Eastern Daylight Time (EDT)
const festivalEndDate = new Date('2025-04-27T15:00:00-04:00').getTime(); // 3:00 PM Eastern Daylight Time (EDT)

//const festivalStartDate = new Date("2025-02-17T00:40:40").getTime();
//const festivalEndDate = new Date("2025-02-17T01:45:00").getTime();

type EventStatus =
  | 'timeRemaining' // Time remaining until key event
  | 'eventStarted' // Event ended over 15 minutes ago
  | 'eventInProgress' // Event in progress
  | 'eventEnded'; // Event has ended

interface CountdownProps {
  statusMessage: string;
  timeLeft: {
    d: number;
    h: number;
    m: number;
    s: number;
  } | null;
  status: EventStatus;
}

const getTimeLeft = (): CountdownProps => {
  const now = new Date().getTime();

  if (now >= festivalEndDate)
    return {
      statusMessage: 'Shred Fest 5 has ended. See you next year! 🤙',
      timeLeft: null,
      status: 'eventEnded',
    };

  const diff = festivalStartDate - now;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  if (now >= festivalStartDate && d == -1 && h >= -1 && m >= -1) {
    return {
      statusMessage: 'Shred Fest 5 is happening NOW! 🛞🔥 Get out there!',
      timeLeft: null,
      status: 'eventStarted',
    };
  }

  if (now >= festivalStartDate)
    return {
      statusMessage: 'Event in progress! 🏁',
      timeLeft: null,
      status: 'eventInProgress',
    };

  return {
    statusMessage: `Shred Fest 5 is coming up in ${dayjs().to(
      festivalStartDate,
      true
    )}! 🎉`,
    timeLeft: { d, h, m, s },
    status: 'timeRemaining',
  };
};

const CountdownTimer: React.FC = () => {
  const [countdown, setCountdown] = useState(getTimeLeft());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onToggleView = () => {
    setIsVisible((prev) => !prev);
  };

  if (['eventEnded', 'eventInProgress'].includes(countdown.status)) return null;

  return (
    <div>
      {countdown.status == 'eventStarted' && <Confetti />}
      <IonCard>
        <IonCardHeader onClick={onToggleView}>
          <IonCardTitle>Countdown</IonCardTitle>
          <IonCardSubtitle>{countdown.statusMessage}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {isVisible && countdown.status == 'timeRemaining' && (
            <div className="ion-padding crazy-bg" onClick={onToggleView}>
              <div className="countdown-container">
                {countdown.timeLeft &&
                  Object.entries(countdown.timeLeft).map(([unit, value]) => (
                    <span key={unit} className="countdown-item">
                      <motion.span
                        key={value}
                        className="countdown-number crazy-text"
                        style={{ display: 'inline-block' }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          type: 'spring',
                          stiffness: 300,
                        }}
                        initial={{ scale: 0.8, y: -5, opacity: 0 }}
                      >
                        {value}
                      </motion.span>
                      <span className="countdown-label crazy-text">
                        {unit}&nbsp;
                      </span>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default CountdownTimer;

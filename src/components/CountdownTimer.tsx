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
import { useCurrentEvent } from '../context/CurrentEventContext';

type EventStatus =
  | 'timeRemaining' // there is time remaining until key event
  | 'eventStarted' // Event started less than 1 minute ago
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

interface CountdownTimerProps {
  onFinish: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onFinish }) => {
  const { eventInfo, loadingEventInfo } = useCurrentEvent();

  const festivalStartDate = new Date(eventInfo.startDate).getTime();
  const festivalEndDate = new Date(eventInfo.endDate).getTime();

  const getTimeLeft = (): CountdownProps => {
    if (loadingEventInfo || !eventInfo.startDate || !eventInfo.endDate) {
      return {
        statusMessage: 'Loading event information...',
        timeLeft: null,
        status: 'eventEnded',
      };
    }

    const now = new Date().getTime();

    if (now >= festivalEndDate)
      return {
        statusMessage: `${eventInfo.title} has ended. See you next year!`,
        timeLeft: null,
        status: 'eventEnded',
      };

    const diff = festivalStartDate - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (now >= festivalStartDate && d == -1 && h >= -1 && m >= -2) {
      return {
        statusMessage: `${eventInfo.title} has started!`,
        timeLeft: null,
        status: 'eventStarted',
      };
    }

    if (now >= festivalStartDate)
      return {
        statusMessage: 'Event in progress! ',
        timeLeft: null,
        status: 'eventInProgress',
      };

    return {
      statusMessage: `${eventInfo.title} is in ${dayjs().to(
        festivalStartDate,
        true
      )}! 🎉`,
      timeLeft: { d, h, m, s },
      status: 'timeRemaining',
    };
  };

  const [countdown, setCountdown] = useState(getTimeLeft());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextCountdown = getTimeLeft();
      setCountdown(nextCountdown);

      // Notify parent to hide when finished
      if (['eventEnded', 'eventInProgress'].includes(nextCountdown.status)) {
        onFinish();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventInfo]);

  if (loadingEventInfo || !eventInfo.startDate || !eventInfo.endDate)
    return null;

  const onToggleView = () => {
    setIsVisible((prev) => !prev);
  };

  if (['eventEnded', 'eventInProgress'].includes(countdown.status)) return null;

  return (
    <div>
      {countdown.status == 'eventStarted' && isVisible && <Confetti />}
      <IonCard className="count-down-card">
        <IonCardHeader onClick={onToggleView}>
          {isVisible && countdown.status !== 'eventStarted' && (
            <IonCardTitle>Countdown</IonCardTitle>
          )}
          <IonCardSubtitle>{countdown.statusMessage}</IonCardSubtitle>
        </IonCardHeader>
        {isVisible && countdown.status == 'timeRemaining' && (
          <IonCardContent>
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
          </IonCardContent>
        )}
      </IonCard>
    </div>
  );
};

export default CountdownTimer;

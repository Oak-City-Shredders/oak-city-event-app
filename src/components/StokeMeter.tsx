import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonProgressBar,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
  IonCard,
} from '@ionic/react';
import { motion } from 'framer-motion';
import './StokeMeter.css';

interface StokeItem {
  id: number;
  text: string;
  link?: string;
  completed?: boolean;
}

const checklistItems: StokeItem[] = [
  { id: 1, text: 'Installed the App', completed: true },
  { id: 2, text: 'Cleared your calendar 4/24-4/27' },
  { id: 3, text: 'Bought ticket', link: 'https://oakcityshredfest.com' },
  { id: 4, text: 'Signed Waiver', link: 'https://waiver.fr/p-cSoyb' },
  {
    id: 5,
    text: 'Planned lodging',
    link: 'https://www.oakcityshredfest.com/close-to-the-farm',
  },
  { id: 6, text: 'Ordered Shred Fest jersey' },
  { id: 7, text: 'Charged Device' },
  { id: 8, text: 'Packed gear' },
];

export default function StokeMeter() {
  const [isListVisible, setIsListVisible] = useState(false);
  const [stokeItems, setStokeItemsToStorage] = useLocalStorage<StokeItem[]>(
    'stoke-meter-v3b',
    checklistItems
  );

  const handleCheck = (id: number) => {
    setStokeItemsToStorage((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  };

  const onToggleView = () => {
    setIsListVisible((prev) => !prev);
  };

  const progress =
    stokeItems.filter((item) => item.completed).length / stokeItems.length;

  return (
    <IonCard>
      <IonCardHeader onClick={onToggleView}>
        <IonCardTitle>Stoke Meter</IonCardTitle>
        <IonCardSubtitle>Are you ready for the fest?</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <motion.div className="cursor-pointer" whileTap={{ scale: 1.02 }} onClick={onToggleView}>
          <div
            className="custom-progress-container mb-4"
          >
            <IonProgressBar value={progress} className="custom-progress-bar" />
          </div>
          <p className="text-lg text-center">
            {stokeItems.filter((i) => i.completed).length} of{' '}
            {stokeItems.length} completed
          </p>
        </motion.div>

        {isListVisible && (
          <>
            <p className="text-center">
              Check off your tasks to get fully stoked for Shred Fest!
            </p>
            <IonList>
              {stokeItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.id * 0.1 }}
                >
                  <IonItem style={{ alignItems: "center" }}>
                    <IonCheckbox
                      checked={item.completed}
                      onIonChange={() => handleCheck(item.id)}
                      disabled={item.id === 1}
                      style={{ flexGrow: 1 }} // Makes checkbox take up available space
                    />
                    <div style={{ textAlign: "right", minWidth: "fit-content" }}>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span style={{ whiteSpace: "nowrap" }}>{item.text}</span>
                      )}
                    </div>
                  </IonItem>
                </motion.div>
              ))}
            </IonList>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
}

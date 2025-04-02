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
  IonList,
  IonCard,
  IonSkeletonText,
} from '@ionic/react';
import { motion } from 'framer-motion';
import './StokeMeter.css';
import Confetti from 'react-confetti';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { checkVibrate } from '../utils/vibrate';
import useFireStoreDB from '../hooks/useFireStoreDB';

interface FireStoreStokeItem {
  id: number;
  text: string;
  link?: string;
  completed?: boolean;
}
interface StokeItem {
  id: number;
  text: string;
  link?: string;
  completed?: boolean;
}

export default function StokeMeter() {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireStoreStokeItem>('StokeMeter');

  const [isListVisible, setIsListVisible] = useState(false);
  const [localStokeItems, setStokeItemsToStorage] = useLocalStorage<
    StokeItem[]
  >('stoke-meter-v3c', [] as StokeItem[]);

  const stokeItemsUpdatedWithLocal: StokeItem[] = !data
    ? []
    : data
        .map(
          (item) =>
            ({
              id: Number(item.id),
              text: item.text,
              completed: item.id === 1 ? true : false,
              // Set the first item as completed by default
              link: item.link,
            } as StokeItem)
        )
        .map((fireBaseItem: StokeItem) => {
          const localItem = localStokeItems.find(
            (i) => i.id === fireBaseItem.id
          );
          return localItem
            ? { ...fireBaseItem, completed: localItem.completed }
            : fireBaseItem;
        })
        .sort((a, b) => a.id - b.id);

  const handleCheck = async (id: number) => {
    checkVibrate(
      async () => await Haptics.impact({ style: ImpactStyle.Light })
    );
    setStokeItemsToStorage(() =>
      stokeItemsUpdatedWithLocal.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      )
    );
  };

  const onToggleView = async () => {
    checkVibrate(
      async () => await Haptics.impact({ style: ImpactStyle.Medium })
    );
    setIsListVisible((prev) => !prev);
  };

  const completedCount = stokeItemsUpdatedWithLocal.filter(
    (item) => item.completed
  ).length;

  const subTitle = () => {
    switch (true) {
      case completedCount === 1:
        return 'Why is your stoke so low? 😔';
      case completedCount < 4:
        return 'Your stoke is on the rise! 🚀';
      case completedCount <= 7:
        return 'Full Stoke is in sight!  🔥';
      case completedCount > 7:
        return 'Fully Stoked about Oak City Shred Fest! 🤘';

      default:
        return 'Are you ready for the fest?';
    }
  };

  const progress = completedCount / stokeItemsUpdatedWithLocal.length;

  return loading ? (
    <IonCard className="stoke-meter">
      <IonCardHeader>
        <IonCardTitle>Stoke Meter</IonCardTitle>
        <IonCardSubtitle>
          <IonSkeletonText animated={true} />
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="custom-progress-container mb-4">
          <IonSkeletonText animated={true} />
        </div>
        <p className="text-lg text-center">
          <IonSkeletonText animated={true} />
        </p>
      </IonCardContent>
    </IonCard>
  ) : (
    <IonCard className="stoke-meter">
      {isListVisible && !loading && progress === 1 && <Confetti />}
      <IonCardHeader onClick={onToggleView}>
        <IonCardTitle>Stoke Meter</IonCardTitle>
        <IonCardSubtitle>{subTitle()}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <motion.div
          className="cursor-pointer"
          whileTap={{ scale: 1.02 }}
          onClick={onToggleView}
        >
          <div className="custom-progress-container mb-4">
            <IonProgressBar value={progress} className="custom-progress-bar" />
          </div>
          <p className="text-lg text-center">
            {`${
              stokeItemsUpdatedWithLocal.filter((i) => i.completed).length
            } of ${stokeItemsUpdatedWithLocal.length} completed`}
          </p>
        </motion.div>

        {isListVisible && (
          <>
            <p className="text-center">
              Check off your tasks to get fully stoked for Shred Fest!
            </p>
            <IonList>
              {stokeItemsUpdatedWithLocal.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.id * 0.1 }}
                >
                  <IonItem style={{ alignItems: 'center' }}>
                    <IonCheckbox
                      checked={item.completed}
                      onIonChange={() => handleCheck(item.id)}
                      disabled={item.id === 1}
                      style={{ flexGrow: 1 }} // Makes checkbox take up available space
                    />
                    <div
                      style={{ textAlign: 'right', minWidth: 'fit-content' }}
                    >
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span style={{ whiteSpace: 'nowrap' }}>
                          {item.text}
                        </span>
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

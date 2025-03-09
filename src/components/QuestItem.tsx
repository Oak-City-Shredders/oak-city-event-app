import { useState, useEffect } from 'react';
import { IonItem, IonLabel, IonIcon, IonCheckbox } from '@ionic/react';
import { qrCodeOutline } from 'ionicons/icons';

export interface Quest {
  id: number;
  text: string;
  completed: boolean;
  requiresScan?: boolean; // If true, the quest requires scanning
  scanValue?: string; // Expected barcode value for completion
}

interface QuestItemProps {
  quest: Quest;
  toggleQuestCompletion: (quest: Quest) => void;
  scanBarcode: (quest: Quest) => void;
}
const QuestItem: React.FC<QuestItemProps> = ({
  quest,
  toggleQuestCompletion,
  scanBarcode,
}) => {
  const [checkboxState, setCheckboxState] = useState(quest.completed);
  const [animate, setAnimate] = useState(false);

  const handleCheckboxChange = () => {
    toggleQuestCompletion(quest);
    setCheckboxState(!checkboxState);
    setAnimate(true);
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false); // Stop the animation after 2-3 seconds
      }, 3000); // Duration of the animation

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [animate]);

  return (
    <IonItem
      key={quest.id}
      onClick={
        quest.requiresScan && !quest.completed
          ? () => scanBarcode(quest)
          : undefined
      }
      style={{
        transition: 'background-color 0.3s, transform 0.3s',
        backgroundColor: animate ? '#e0f7fa' : 'transparent', // Background color change
        transform: animate ? 'scale(1.1)' : 'scale(1)', // Scale animation
      }}
    >
      <IonLabel>{quest.text}</IonLabel>

      {quest.requiresScan && !quest.completed && (
        <IonLabel>
          <IonIcon icon={qrCodeOutline} />
        </IonLabel>
      )}
      <IonCheckbox
        slot="end"
        checked={checkboxState}
        color="success"
        disabled={quest.requiresScan && !quest.completed} // Disable checkbox if scan required
        onIonChange={handleCheckboxChange}
      />
    </IonItem>
  );
};

export default QuestItem;

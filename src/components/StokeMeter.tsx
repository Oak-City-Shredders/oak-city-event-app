import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage"
import { IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonProgressBar, IonCheckbox, IonItem, IonLabel, IonList, IonCard } from "@ionic/react";
import { motion } from "framer-motion";
import "./StokeMeter.css";

interface StokeItem {
  id: number;
  text: string;
  link?: string;
  completed?: boolean;
}

const checklistItems: StokeItem[] = [
  { id: 1, text: "Installed the App", completed: true },
  { id: 8, text: "Cleared your calendar 4/24-4/27" },
  { id: 2, text: "Bought ticket", link: "https://oakcityshredfest.com" },
  { id: 3, text: "Signed Waiver", link: "https://waiver.fr/p-cSoyb" },
  { id: 4, text: "Planned lodging", link: "https://www.oakcityshredfest.com/close-to-the-farm" },
  { id: 6, text: "Ordered Shred Fest jersey"},
  { id: 5, text: "Charged Device"},
  { id: 7, text: "Packed gear"},
];

export default function StokeMeter() {
  const [isListVisible, setIsListVisible] = useState(false);
  const [stokeItems, setStokeItemsToStorage] = useLocalStorage<StokeItem[]>("stoke-meter-v3a", checklistItems);
  
  const handleCheck = (id: number) => {
    setStokeItemsToStorage(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const onToggleView = () => {
    setIsListVisible(prev => !prev);
  }

  const progress =
    stokeItems.filter((item) => item.completed).length / stokeItems.length;

  return (
     <IonCard >
      <IonCardHeader>
      <IonCardTitle>Stoke Meter</IonCardTitle>
      <IonCardSubtitle>Are you ready for the fest?</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent >
        <motion.div
          className="cursor-pointer"
          
          whileTap={{ scale: 1.02 }}
        >
          <div onClick={onToggleView} className="custom-progress-container mb-4">
            <IonProgressBar value={progress} className="custom-progress-bar" />
          </div>
          <p className="text-lg text-center">{stokeItems.filter(i => i.completed).length} of {stokeItems.length} completed</p>
        </motion.div>

        {isListVisible && (
          <>
          <p className="text-center">Check off your tasks to get fully stoked for Shred Fest!</p>
          <IonList>
          
          {stokeItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.id * 0.1 }}
            >
              <IonItem>
                <IonCheckbox
                  labelPlacement="end"
                  checked={item.completed}
                  onIonChange={() => handleCheck(item.id)}
                  disabled={item.id === 1}
                >
                  <IonLabel><a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.text}
                  </a></IonLabel>
                </IonCheckbox>
              </IonItem>
            </motion.div>
            
          ))}
        </IonList></>)}
        </IonCardContent>
        </IonCard>
  
  );
}

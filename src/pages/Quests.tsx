import React, { useState } from "react";
import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonLabel, IonItem } from "@ionic/react";
import useLocalStorage from "../hooks/useLocalStorage";
import questList from "../data/quests.json";

interface Quest {
  id: number;
  text: string;
  completed: boolean;
}

const QuestsPage: React.FC = () => {
  const [quests, setQuests] = useLocalStorage<Quest[]>("quests", questList);

  const toggleQuestCompletion = (id: number) => {
    setQuests(
      quests.map((quest:any) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest
      )
    );
  };

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <img
            src="/images/quests-small.webp"
            alt="Quests"
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
          />
          <IonCardContent>
            <IonCardHeader>
              <IonCardTitle>Side Quests</IonCardTitle>
            </IonCardHeader>
            <div>
              {quests.map((quest:any) => (
                <IonItem key={quest.id} style={{ marginBottom: "10px" }}>
                  <IonCheckbox
                    checked={quest.completed}
                    color="success"
                    onIonChange={() => toggleQuestCompletion(quest.id)}
                  />
                  <IonLabel>{quest.text}</IonLabel>
                </IonItem>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default QuestsPage;

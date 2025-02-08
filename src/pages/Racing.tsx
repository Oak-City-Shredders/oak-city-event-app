import React, { useMemo } from "react";
import { IonListHeader, IonHeader, IonToolbar, IonPage, IonContent, IonList, IonItem, IonLabel, IonText, IonSpinner, IonTitle } from "@ionic/react";
import useGoogleSheets from "../hooks/useGoogleSheets";
import { getErrorMessage } from "../utils/errorUtils";

interface Racer {
  name: string;
  team?: string;
}

interface Category {
  id: number;
  name: string;
  racers: Racer[];
}

const Raceing: React.FC = () => {
  const SHEET_ID = import.meta.env.VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = "Sheet1!A:C"; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_ID, RANGE);

  const groupedCategories: Category[] | undefined = useMemo(() => {
    if (!sheetsData) return undefined;

    const data: { category: string; racer: Racer }[] = sheetsData.slice(1).map(([category, racer, team]: string[]) => ({
      category,
      racer: { name: racer, team },
    }));

    const grouped = data.reduce<Record<string, Racer[]>>((acc, { category, racer }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(racer);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, racers], id) => ({
      id,
      name,
      racers,
    }));
  }, [sheetsData]);

  return (
    <IonPage>
        <IonHeader>
                <IonToolbar>
                  <IonTitle>Registered Racers</IonTitle>
                </IonToolbar>
              </IonHeader>
      <IonContent fullscreen className="ion-padding">

        {loading ? (
          <IonSpinner name="dots" />
        ) : error ? (
          <IonText color="danger">
            <p>Error loading racing data, please check back later.</p>
            <p>{getErrorMessage(error)}</p>
          </IonText>
        ) : !groupedCategories || groupedCategories.length === 0 ? (
          <IonText>No racers are currently available to be shown.</IonText>
        ) : (
          groupedCategories.map((category) => (
            <IonList key={category.id}>
              <IonListHeader>
                <IonLabel>{category.name}</IonLabel>
              </IonListHeader>
              <IonTitle></IonTitle>
              {category.racers.map((racer, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    {racer.name} {racer.team ? `[${racer.team}]` : ""}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Raceing;

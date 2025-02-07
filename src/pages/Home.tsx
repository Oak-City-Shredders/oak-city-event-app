import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import CardLayout from "../components/CardLayout";
import { useIonRouter } from "@ionic/react";
import { homePageLayout } from "../data/homePageLayout";

const Home: React.FC = () => {
  const router = useIonRouter();

  const handleCardClick = (route: string) => {
    router.push(route, "forward"); // "forward" for a page transition effect
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"primary"}>
          <IonTitle>Oak City Shred Fest 5</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CardLayout items={homePageLayout} handleCardClick={handleCardClick} />

      </IonContent>
    </IonPage>
  );
};

export default Home;
